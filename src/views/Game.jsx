import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getCurrentUser } from '../services/auth';
import GameBoard from '../components/GameBoard';
import PlayerCard from '../components/PlayerCard';
import '../assets/styles/game.css';

function Game() {
  const { id: partidaId } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [diceRolling, setDiceRolling] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [playerCards, setPlayerCards] = useState([]);
  const [buyingCard, setBuyingCard] = useState(false);
  const [lastDiceValue, setLastDiceValue] = useState(null);

  // REFERENCIAS PARA CONTROLAR EFECTOS
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const loadingRef = useRef(false);

  // Verificar autenticación
  useEffect(() => {
    if (!currentUser?.id) {
      navigate('/login');
      return;
    }
    
    if (!partidaId || partidaId === 'undefined') {
      setError('ID de partida inválido');
      setTimeout(() => navigate('/partidas'), 2000);
      return;
    }
  }, [currentUser, partidaId, navigate]);

  // FUNCIÓN PRINCIPAL DE CARGA - OPTIMIZADA
  const loadGameState = useCallback(async (isInitialLoad = false) => {
    // Prevenir múltiples cargas simultáneas
    if (loadingRef.current || !partidaId || !currentUser?.id) return;
    
    try {
      loadingRef.current = true;
      
      if (isInitialLoad) {
        setLoading(true);
        console.log('🚀 Carga inicial del juego...');
      }
      
      const data = await api.getGameState(partidaId);
      
      if (!isMountedRef.current) return;
      
      if (!data?.jugadores) {
        throw new Error('Datos de partida inválidos');
      }
      
      const isPlayerInGame = data.jugadores.some(j => j.usuarioId === currentUser.id);
      if (!isPlayerInGame) {
        throw new Error('No estás registrado en esta partida');
      }
      
      setGameState(data);
      setError('');
      
      if (isInitialLoad) {
        console.log('✅ Juego cargado exitosamente');
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      if (isMountedRef.current) {
        setError(error.message);
        
        if (error.message.includes('Token') || error.message.includes('autorizado')) {
          navigate('/login');
          return;
        }
        
        if (error.message.includes('encontrada') || error.message.includes('inválido')) {
          setTimeout(() => navigate('/partidas'), 3000);
          return;
        }
      }
    } finally {
      loadingRef.current = false;
      if (isInitialLoad && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [partidaId, currentUser, navigate]);

  // CARGA INICIAL - SOLO UNA VEZ
  useEffect(() => {
    if (currentUser?.id && partidaId) {
      loadGameState(true);
    }
  }, [partidaId, currentUser?.id]); // Solo estas dependencias

  // POLLING MODERADO - SOLO DESPUÉS DE CARGA INICIAL
  useEffect(() => {
    if (!gameState || loading) return;

    console.log('⏰ Configurando polling cada 15 segundos...');
    
    // Limpiar interval anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Polling cada 15 segundos (muy moderado)
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current && !loadingRef.current && !diceRolling) {
        loadGameState(false);
      }
    }, 15000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameState, loading, diceRolling, loadGameState]);

  // CARGAR CARTAS
  const loadPlayerCards = useCallback(async () => {
    if (!partidaId || !currentUser?.id) return;
    
    try {
      const data = await api.getPlayerCards(partidaId, currentUser.id);
      if (isMountedRef.current) {
        setPlayerCards(data.cartas || []);
      }
    } catch (error) {
      console.error('Error cargando cartas:', error);
    }
  }, [partidaId, currentUser?.id]);

  // CARGAR CARTAS CUANDO CAMBIE EL ESTADO
  useEffect(() => {
    if (gameState && !loading) {
      loadPlayerCards();
    }
  }, [gameState?.jugadores?.length, loadPlayerCards, loading]);

  // CLEANUP AL DESMONTAR
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // FUNCIONES DEL JUEGO
  const handleRollDice = async () => {
    if (diceRolling || !isMyTurn()) return;

    try {
      setDiceRolling(true);
      setError('');
      setLastDiceValue(null);
      
      console.log('🎲 Lanzando dado...');
      const result = await api.rollDice(partidaId, currentUser.id);
      
      if (result?.valorDado) {
        setLastDiceValue(result.valorDado);
      }
      
      // Actualizar después del dado
      setTimeout(async () => {
        if (isMountedRef.current) {
          await loadGameState(false);
          setDiceRolling(false);
          setLastDiceValue(null);
        }
      }, 2000);
      
    } catch (error) {
      if (isMountedRef.current) {
        setError('Error al lanzar el dado: ' + error.message);
        setDiceRolling(false);
        setLastDiceValue(null);
      }
    }
  };

  const handleBuyCard = async () => {
    if (buyingCard) return;

    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer || currentPlayer.monedas < 2) {
      setError('No tienes suficientes monedas (necesitas 2)');
      return;
    }

    try {
      setBuyingCard(true);
      setError('');
      
      await api.buyCard(partidaId, currentUser.id);
      
      // Actualizar cartas y estado
      await Promise.all([
        loadPlayerCards(),
        loadGameState(false)
      ]);
      
    } catch (error) {
      setError('Error al comprar carta: ' + error.message);
    } finally {
      setBuyingCard(false);
    }
  };

  // FUNCIONES AUXILIARES
  const getCurrentPlayer = () => {
    return gameState?.jugadores?.find(j => j.usuarioId === currentUser.id) || null;
  };

  const getCurrentTurnPlayer = () => {
    return gameState?.jugadores?.find(j => j.enTurno) || null;
  };

  const isMyTurn = () => {
    const currentTurnPlayer = getCurrentTurnPlayer();
    return currentTurnPlayer && currentTurnPlayer.usuarioId === currentUser.id;
  };

  // ESTADOS DE RENDERIZADO
  if (loading) {
    return (
      <div className="game">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando juego...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !gameState) {
    return (
      <div className="game">
        <div className="error-container">
          <h2>😕 Error al cargar el juego</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => loadGameState(true)} className="btn btn-primary">
              Reintentar
            </button>
            <button onClick={() => navigate('/partidas')} className="btn btn-secondary">
              Volver a Partidas
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="game">
        <div className="error-container">
          <h2>🎮 Cargando partida...</h2>
          <p>Obteniendo información del juego</p>
          <button onClick={() => loadGameState(true)} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const currentPlayer = getCurrentPlayer();
  const currentTurnPlayer = getCurrentTurnPlayer();

  return (
    <div className="game">
      <div className="game-container">
        {/* Header del juego */}
        <div className="game-header">
          <div className="game-info">
            <h1>{gameState.partida?.nombre || 'Escaleras y Serpientes'}</h1>
            <p>Partida #{partidaId} • {gameState.totalJugadores} jugadores</p>
          </div>
          
          <div className="game-status">
            <span className={`status-badge ${gameState.partida?.estado}`}>
              {gameState.partida?.estado === 'en_curso' ? 'En curso' : 
               gameState.partida?.estado === 'en_espera' ? 'Esperando' : 
               gameState.partida?.estado}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        {/* Información del turno */}
        <div className="turn-info">
          {currentTurnPlayer ? (
            <div className="turn-display">
              <span className="turn-label">Turno de:</span>
              <span className="turn-player">
                {currentTurnPlayer.nombre}
                {isMyTurn() && <span className="your-turn"> (¡Tu turno!)</span>}
              </span>
            </div>
          ) : (
            <div className="turn-display">
              <span className="turn-label">Esperando jugadores...</span>
            </div>
          )}
        </div>

        <div className="game-layout">
          {/* Panel izquierdo - Jugadores */}
          <div className="players-panel">
            <h3>👥 Jugadores</h3>
            <div className="players-list">
              {gameState.jugadores && gameState.jugadores.map((jugador) => (
                <PlayerCard
                  key={jugador.usuarioId}
                  player={jugador}
                  isCurrentUser={jugador.usuarioId === currentUser.id}
                  isCurrentTurn={jugador.enTurno}
                />
              ))}
            </div>
          </div>

          {/* Tablero central */}
          <div className="board-panel">
            <GameBoard 
              gameState={gameState}
              currentUserId={currentUser.id}
              diceValue={lastDiceValue}
              isDiceRolling={diceRolling}
            />
          </div>

          {/* Panel derecho - Controles */}
          <div className="controls-panel">
            <h3>🎮 Controles</h3>
            
            {/* Dado */}
            <div className="control-section">
              <div className="dice-container">
                <div className={`dice ${diceRolling ? 'rolling' : ''}`}>
                  {diceRolling ? '🎲' : (lastDiceValue || '?')}
                </div>
                <button
                  className="btn btn-primary dice-button"
                  onClick={handleRollDice}
                  disabled={!isMyTurn() || diceRolling}
                >
                  {diceRolling ? 'Lanzando...' : 'Lanzar Dado'}
                </button>
              </div>
            </div>

            {/* Estado del jugador */}
            {currentPlayer && (
              <div className="control-section">
                <h4>Tu Estado</h4>
                <div className="player-stats">
                  <div className="stat-item">
                    <span className="stat-label">Posición:</span>
                    <span className="stat-value">{currentPlayer.posicion}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Monedas:</span>
                    <span className="stat-value">{currentPlayer.monedas}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Cartas:</span>
                    <span className="stat-value">{playerCards.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sistema de cartas */}
            <div className="control-section">
              <h4>Cartas</h4>
              <button
                className="btn btn-secondary"
                onClick={handleBuyCard}
                disabled={buyingCard || !currentPlayer || currentPlayer.monedas < 2}
              >
                {buyingCard ? 'Comprando...' : 'Comprar Carta (2 💰)'}
              </button>
              
              <button
                className="btn btn-secondary"
                onClick={() => setShowCards(!showCards)}
              >
                {showCards ? 'Ocultar' : 'Ver'} Cartas ({playerCards.length})
              </button>

              {showCards && (
                <div className="cards-list">
                  {playerCards.length === 0 ? (
                    <p className="no-cards">No tienes cartas</p>
                  ) : (
                    playerCards.map((carta, index) => (
                      <div key={index} className="card-item">
                        <div className="card-name">{carta.nombre || carta.tipo}</div>
                        <div className="card-description">{carta.descripcion}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Botón salir */}
            <div className="control-section">
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm('¿Salir del juego?')) {
                    navigate('/partidas');
                  }
                }}
              >
                Salir del Juego
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
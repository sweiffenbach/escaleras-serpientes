import { useState, useEffect } from 'react';

function GameBoard({ gameState, currentUserId, diceValue, isDiceRolling }) {
  const [highlightedCell, setHighlightedCell] = useState(null);
  
  // Configuración del tablero con escaleras y serpientes
  const ladders = {
    1: 38, 4: 14, 9: 31, 16: 6, 21: 42,
    28: 84, 36: 44, 48: 26, 51: 67, 62: 19,
    64: 60, 71: 91, 80: 100, 87: 24, 93: 73,
    95: 75, 98: 78
  };

  const snakes = {
    6: 16, 23: 8, 34: 1, 47: 25, 56: 19,
    68: 50, 75: 53, 83: 45, 85: 59, 90: 48,
    92: 25, 97: 87, 99: 63
  };

  // Función para determinar el tipo de casilla
  const getCellType = (position) => {
    if (ladders[position]) return 'ladder-start';
    if (Object.values(ladders).includes(position)) return 'ladder-end';
    if (snakes[position]) return 'snake-head';
    if (Object.values(snakes).includes(position)) return 'snake-tail';
    if (position === 100) return 'finish';
    if (position === 1) return 'start';
    return 'normal';
  };

  // Función para obtener el ícono de la casilla
  const getCellIcon = (position) => {
    const type = getCellType(position);
    switch (type) {
      case 'ladder-start': return '🪜';
      case 'ladder-end': return '⬆️';
      case 'snake-head': return '🐍';
      case 'snake-tail': return '🔽';
      case 'finish': return '🏁';
      case 'start': return '🟢';
      default: return '';
    }
  };

  // Función para obtener información adicional de la casilla
  const getCellInfo = (position) => {
    if (ladders[position]) {
      return `Escalera: sube a ${ladders[position]}`;
    }
    if (snakes[position]) {
      return `Serpiente: baja a ${snakes[position]}`;
    }
    return null;
  };

  // Función para obtener jugadores en una posición
  const getPlayersAtPosition = (position) => {
    if (!gameState?.jugadores) return [];
    return gameState.jugadores.filter(player => player.posicion === position);
  };

  // Crear el array del tablero (1-100, en formato serpentina)
  const createBoard = () => {
    const board = [];
    for (let row = 9; row >= 0; row--) {
      const rowCells = [];
      
      if (row % 2 === 1) {
        // Filas impares: de izquierda a derecha
        for (let col = 0; col < 10; col++) {
          rowCells.push(row * 10 + col + 1);
        }
      } else {
        // Filas pares: de derecha a izquierda
        for (let col = 9; col >= 0; col--) {
          rowCells.push(row * 10 + col + 1);
        }
      }
      
      board.push(rowCells);
    }
    return board;
  };

  const board = createBoard();

  // Efecto para resaltar casilla cuando se lanza el dado
  useEffect(() => {
    if (diceValue && currentUserId && gameState?.jugadores) {
      const currentPlayer = gameState.jugadores.find(p => p.usuarioId === currentUserId);
      if (currentPlayer) {
        const targetPosition = Math.min(currentPlayer.posicion + diceValue, 100);
        setHighlightedCell(targetPosition);
        
        // Quitar resaltado después de 3 segundos
        setTimeout(() => setHighlightedCell(null), 3000);
      }
    }
  }, [diceValue, currentUserId, gameState]);

  if (!gameState) {
    return (
      <div className="game-board">
        <div className="board-loading">
          <p>Cargando tablero...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-board">
      <div className="board-header">
        <h3>🎲 Tablero de Escaleras y Serpientes</h3>
        {isDiceRolling && (
          <div className="dice-animation">
            🎲 Lanzando dado...
          </div>
        )}
      </div>

      <div className="board-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cellNumber) => {
              const cellType = getCellType(cellNumber);
              const cellInfo = getCellInfo(cellNumber);
              const playersHere = getPlayersAtPosition(cellNumber);
              const isHighlighted = highlightedCell === cellNumber;
              
              return (
                <div
                  key={cellNumber}
                  className={`board-cell ${cellType} ${isHighlighted ? 'highlighted' : ''} ${playersHere.length > 0 ? 'has-players' : ''}`}
                  title={cellInfo || `Casilla ${cellNumber}`}
                >
                  {/* Número de la casilla */}
                  <div className="cell-number">{cellNumber}</div>
                  
                  {/* Ícono de la casilla */}
                  <div className="cell-icon">
                    {getCellIcon(cellNumber)}
                  </div>
                  
                  {/* Jugadores en esta casilla */}
                  {playersHere.length > 0 && (
                    <div className="players-here">
                      {playersHere.map((player, index) => (
                        <div
                          key={player.usuarioId}
                          className={`player-token ${player.usuarioId === currentUserId ? 'current-user' : ''}`}
                          style={{
                            transform: `translate(${index * 3}px, ${index * 3}px)`,
                            zIndex: 10 + index
                          }}
                          title={player.nombre}
                        >
                          {player.nombre.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Leyenda del tablero */}
      <div className="board-legend">
        <div className="legend-item">
          <span className="legend-icon">🪜</span>
          <span>Escalera (sube)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🐍</span>
          <span>Serpiente (baja)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🏁</span>
          <span>Meta</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon player-token-example">A</span>
          <span>Jugadores</span>
        </div>
      </div>

      {/* Estado de debug */}
      {process.env.NODE_ENV === 'development' && (
        <div className="board-debug">
          <small>Jugadores: {gameState.jugadores?.length || 0}</small>
          <small>Mi turno: {gameState.jugadores?.find(j => j.usuarioId === currentUserId)?.enTurno ? 'Sí' : 'No'}</small>
        </div>
      )}
    </div>
  );
}

export default GameBoard;



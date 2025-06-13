import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getCurrentUser } from '../services/auth';
import '../assets/styles/partidas.css';

function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedPartida, setSelectedPartida] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [joiningPartida, setJoiningPartida] = useState(false);
  
  const [newPartida, setNewPartida] = useState({
    Nombre: '',
    Tipo: 'pública',
    MaxJugadores: 4
  });

  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Cargar partidas al montar el componente
  useEffect(() => {
    loadPartidas();
    
    // Actualizar cada 10 segundos
    const interval = setInterval(loadPartidas, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadPartidas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getPartidas();
      setPartidas(data || []);
    } catch (error) {
      console.error('Error cargando partidas:', error);
      setError('Error al cargar las partidas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePartida = async (e) => {
    e.preventDefault();
    
    if (!newPartida.Nombre.trim()) {
      setError('El nombre de la partida es requerido');
      return;
    }
    
    try {
      setError('');
      const partidaData = {
        ...newPartida,
        PropietarioID: currentUser.id
      };

      const response = await api.createPartida(partidaData);
      
      setSuccess(response.mensaje || 'Partida creada exitosamente');
      
      // Si es privada, mostrar el código
      if (response.CodigoInvitacion) {
        setSuccess(`Partida privada creada. Código: ${response.CodigoInvitacion}`);
      }
      
      // Actualizar lista de partidas
      await loadPartidas();
      
      // Cerrar modal y limpiar formulario
      setShowCreateModal(false);
      setNewPartida({
        Nombre: '',
        Tipo: 'pública',
        MaxJugadores: 4
      });

      // Unirse automáticamente a la partida creada
      setTimeout(() => {
        joinPartida(response.PartidaID, response.CodigoInvitacion);
      }, 1000);
      
    } catch (error) {
      setError('Error al crear la partida: ' + error.message);
    }
  };

  const joinPartida = async (partidaId, codigoInvitacion = null) => {
    if (joiningPartida) return;
    
    try {
      setJoiningPartida(true);
      setError('');
      
      const joinData = {
        UsuarioID: currentUser.id,
        PartidaID: partidaId,
        ...(codigoInvitacion && { CodigoInvitacion: codigoInvitacion })
      };

      await api.joinPartida(joinData);
      
      setSuccess('¡Te has unido exitosamente a la partida!');
      
      // Redirigir al juego después de un breve delay
      setTimeout(() => {
        navigate(`/game/${partidaId}`);
      }, 1500);
      
    } catch (error) {
      setError('Error al unirse a la partida: ' + error.message);
    } finally {
      setJoiningPartida(false);
    }
  };

  const handleJoinPrivatePartida = async (e) => {
    e.preventDefault();
    if (!selectedPartida || !joinCode.trim()) {
      setError('Debes ingresar un código de invitación válido');
      return;
    }

    await joinPartida(selectedPartida.PartidaID, joinCode);
    setShowJoinModal(false);
    setJoinCode('');
    setSelectedPartida(null);
  };

  const openJoinModal = (partida) => {
    setSelectedPartida(partida);
    setJoinCode('');
    setError('');
    setShowJoinModal(true);
  };

  const deletePartida = async (partidaId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta partida?')) {
      return;
    }

    try {
      setError('');
      await api.deletePartida(partidaId);
      setSuccess('Partida eliminada exitosamente');
      await loadPartidas();
    } catch (error) {
      setError('Error al eliminar la partida: ' + error.message);
    }
  };

  const startPartida = async (partidaId) => {
    try {
      setError('');
      await api.startPartida(partidaId);
      setSuccess('Partida iniciada exitosamente');
      await loadPartidas();
      
      // Redirigir al juego
      setTimeout(() => {
        navigate(`/game/${partidaId}`);
      }, 1000);
    } catch (error) {
      setError('Error al iniciar la partida: ' + error.message);
    }
  };

  const canJoinPartida = (partida) => {
    // No puede unirse si es el propietario
    if (partida.PropietarioID === currentUser.id) return false;
    
    // No puede unirse si la partida está llena
    if (partida.jugadores_count >= partida.MaxJugadores) return false;
    
    // No puede unirse si la partida ya terminó
    if (partida.EstadoPartida === 'finalizada') return false;
    
    return true;
  };

  const canStartPartida = (partida) => {
    // Solo el propietario puede iniciar
    if (partida.PropietarioID !== currentUser.id) return false;
    
    // Solo si está en espera
    if (partida.EstadoPartida !== 'en_espera') return false;
    
    // Necesita al menos 2 jugadores
    if (partida.jugadores_count < 2) return false;
    
    return true;
  };

  const canViewPartida = (partida) => {
    // Puede ver si está en curso o si es el propietario
    return partida.EstadoPartida === 'en_curso' || partida.PropietarioID === currentUser.id;
  };

  if (loading && partidas.length === 0) {
    return (
      <div className="partidas">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando partidas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="partidas">
      <div className="partidas-container">
        {/* Header */}
        <div className="partidas-header">
          <div className="header-content">
            <h1>🎮 Partidas Disponibles</h1>
            <p>Únete a una partida existente o crea una nueva</p>
          </div>
          <button 
            className="btn btn-primary create-btn"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Crear Nueva Partida
          </button>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        {success && (
          <div className="success-message">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="close-success">×</button>
          </div>
        )}

        {/* Estadísticas */}
        <div className="partidas-stats">
          <div className="stat-card">
            <div className="stat-number">{partidas.length}</div>
            <div className="stat-label">Partidas Totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {partidas.filter(p => p.EstadoPartida === 'en_espera').length}
            </div>
            <div className="stat-label">Esperando Jugadores</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {partidas.filter(p => p.EstadoPartida === 'en_curso').length}
            </div>
            <div className="stat-label">En Curso</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {partidas.filter(p => p.Tipo === 'pública').length}
            </div>
            <div className="stat-label">Públicas</div>
          </div>
        </div>

        {/* Lista de partidas */}
        <div className="partidas-list">
          {partidas.length === 0 ? (
            <div className="no-partidas">
              <div className="no-partidas-icon">🎲</div>
              <h3>No hay partidas disponibles</h3>
              <p>¡Sé el primero en crear una partida!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Crear Primera Partida
              </button>
            </div>
          ) : (
            partidas.map((partida) => {
              const isOwner = partida.PropietarioID === currentUser.id;
              
              return (
                <div key={partida.PartidaID} className={`partida-card ${partida.EstadoPartida}`}>
                  {/* Header de la carta */}
                  <div className="partida-header">
                    <div className="partida-title">
                      <h3>{partida.Nombre}</h3>
                      <div className="partida-badges">
                        <span className={`badge ${partida.Tipo}`}>
                          {partida.Tipo === 'pública' ? '🌍 Pública' : '🔒 Privada'}
                        </span>
                        <span className={`badge estado ${partida.EstadoPartida}`}>
                          {partida.EstadoPartida === 'en_espera' ? '⏳ Esperando' : 
                           partida.EstadoPartida === 'en_curso' ? '🎮 En Curso' : 
                           '🏁 Finalizada'}
                        </span>
                        {isOwner && <span className="badge owner">👑 Tuya</span>}
                      </div>
                    </div>
                  </div>

                  {/* Información de la partida */}
                  <div className="partida-info">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">👥 Jugadores:</span>
                        <span className="info-value">
                          {partida.jugadores_count || 0} / {partida.MaxJugadores}
                        </span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">👑 Propietario:</span>
                        <span className="info-value">
                          {partida.Propietario?.NombreUsuario || 'Desconocido'}
                        </span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">📅 Creada:</span>
                        <span className="info-value">
                          {new Date(partida.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {partida.Tipo === 'privada' && isOwner && partida.CodigoInvitacion && (
                        <div className="info-item codigo-item">
                          <span className="info-label">🔑 Código:</span>
                          <span className="info-value codigo">
                            {partida.CodigoInvitacion}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="partida-actions">
                    {canJoinPartida(partida) && (
                      <>
                        {partida.Tipo === 'pública' ? (
                          <button 
                            className="btn btn-primary"
                            onClick={() => joinPartida(partida.PartidaID)}
                            disabled={joiningPartida}
                          >
                            {joiningPartida ? 'Uniéndose...' : '🎯 Unirse'}
                          </button>
                        ) : (
                          <button 
                            className="btn btn-primary"
                            onClick={() => openJoinModal(partida)}
                            disabled={joiningPartida}
                          >
                            🔑 Ingresar Código
                          </button>
                        )}
                      </>
                    )}
                    
                    {canStartPartida(partida) && (
                      <button 
                        className="btn btn-success"
                        onClick={() => startPartida(partida.PartidaID)}
                      >
                        🚀 Iniciar Partida
                      </button>
                    )}
                    
                    {canViewPartida(partida) && (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => navigate(`/game/${partida.PartidaID}`)}
                      >
                        👁️ Ver Partida
                      </button>
                    )}
                    
                    {isOwner && partida.EstadoPartida === 'en_espera' && (
                      <button 
                        className="btn btn-danger"
                        onClick={() => deletePartida(partida.PartidaID)}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Crear Partida */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>🆕 Crear Nueva Partida</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreatePartida} className="modal-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre de la partida</label>
                  <input
                    type="text"
                    id="nombre"
                    value={newPartida.Nombre}
                    onChange={(e) => setNewPartida({
                      ...newPartida,
                      Nombre: e.target.value
                    })}
                    required
                    placeholder="Ej: Partida épica de escaleras"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tipo">Tipo de partida</label>
                  <select
                    id="tipo"
                    value={newPartida.Tipo}
                    onChange={(e) => setNewPartida({
                      ...newPartida,
                      Tipo: e.target.value
                    })}
                  >
                    <option value="pública">🌍 Pública (cualquiera puede unirse)</option>
                    <option value="privada">🔒 Privada (requiere código)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="maxJugadores">Máximo de jugadores</label>
                  <select
                    id="maxJugadores"
                    value={newPartida.MaxJugadores}
                    onChange={(e) => setNewPartida({
                      ...newPartida,
                      MaxJugadores: parseInt(e.target.value)
                    })}
                  >
                    <option value={2}>2 jugadores</option>
                    <option value={3}>3 jugadores</option>
                    <option value={4}>4 jugadores</option>
                    <option value={6}>6 jugadores</option>
                  </select>
                </div>
                
                {newPartida.Tipo === 'privada' && (
                  <div className="info-box">
                    <p>💡 Se generará automáticamente un código de invitación único para tu partida privada.</p>
                  </div>
                )}
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    🎮 Crear Partida
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Unirse a Partida Privada */}
        {showJoinModal && selectedPartida && (
          <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>🔑 Unirse a Partida Privada</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowJoinModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="partida-preview">
                <h3>{selectedPartida.Nombre}</h3>
                <p>👑 Propietario: {selectedPartida.Propietario?.NombreUsuario}</p>
                <p>👥 Jugadores: {selectedPartida.jugadores_count}/{selectedPartida.MaxJugadores}</p>
              </div>
              
              <form onSubmit={handleJoinPrivatePartida} className="modal-form">
                <div className="form-group">
                  <label htmlFor="codigo">Código de invitación</label>
                  <input
                    type="text"
                    id="codigo"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    required
                    placeholder="Ej: ABC123"
                    maxLength={10}
                    style={{ textTransform: 'uppercase' }}
                  />
                  <small>Introduce el código de 6 caracteres que te proporcionó el creador de la partida</small>
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowJoinModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={joiningPartida}
                  >
                    {joiningPartida ? 'Uniéndose...' : '🎯 Unirse a Partida'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Partidas;
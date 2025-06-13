import '../assets/styles/player-card.css';

function PlayerCard({ player, isCurrentUser, isCurrentTurn }) {
  const getPlayerIcon = (position) => {
    // Diferentes íconos según la posición
    if (position >= 90) return '👑'; // Corona para los que están cerca de ganar
    if (position >= 70) return '🚀'; // Cohete para los avanzados
    if (position >= 40) return '🏃'; // Corriendo para los del medio
    if (position >= 20) return '🚶'; // Caminando para los iniciales
    return '🐣'; // Pollito para los que recién empiezan
  };

  const getPositionColor = (position) => {
    if (position >= 90) return '#ffd700'; // Dorado
    if (position >= 70) return '#ff6b6b'; // Rojo
    if (position >= 40) return '#4ecdc4'; // Turquesa
    if (position >= 20) return '#45b7d1'; // Azul


    return '#96ceb4'; // Verde claro
  };

  return (
    <div className={`player-card ${isCurrentUser ? 'current-user' : ''} ${isCurrentTurn ? 'current-turn' : ''}`}>
      {/* Avatar del jugador */}
      <div className="player-avatar" style={{ backgroundColor: getPositionColor(player.posicion) }}>
        <span className="player-icon">{getPlayerIcon(player.posicion)}</span>
        {isCurrentTurn && <div className="turn-indicator">▶</div>}
      </div>

      {/* Información del jugador */}
      <div className="player-info">
        <div className="player-name">
          {player.nombre}
          {isCurrentUser && <span className="you-label">(Tú)</span>}
        </div>

        <div className="player-stats">
          <div className="stat">
            <span className="stat-icon">📍</span>
            <span className="stat-label">Pos.</span>
            <span className="stat-value">{player.posicion}/100</span>
          </div>

          <div className="stat">
            <span className="stat-icon">💰</span>
            <span className="stat-label">Monedas</span>
            <span className="stat-value">{player.monedas}</span>
          </div>

          <div className="stat">
            <span className="stat-icon">🃏</span>
            <span className="stat-label">Cartas</span>
            <span className="stat-value">{player.cartas || 0}</span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${player.posicion}%`,
              backgroundColor: getPositionColor(player.posicion)
            }}
          ></div>
          <span className="progress-text">{player.posicion}%</span>
        </div>

        {/* Estado del jugador */}
        <div className="player-status">
          {isCurrentTurn && (
            <span className="status-badge turn-badge">
              🎯 Su turno
            </span>
          )}

          {player.efectosActivos && Object.keys(player.efectosActivos).length > 0 && (
            <span className="status-badge effects-badge">
              ✨ Con efectos
            </span>
          )}

          {player.posicion >= 90 && (
            <span className="status-badge winning-badge">
              🏆 ¡Cerca de ganar!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;


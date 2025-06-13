import { Link } from 'react-router-dom';
import '../assets/styles/instructions.css';

function Instructions() {
  return (
    <div className="instructions">
      <div className="instructions-container">
        {/* Header */}
        <div className="instructions-header">
          <h1>¿Cómo jugar Escaleras y Serpientes?</h1>
          <p>Aprende las reglas del juego clásico con nuestras nuevas mecánicas especiales</p>
        </div>

        {/* Reglas básicas */}
        <section className="instructions-section">
          <h2>🎲 Reglas Básicas</h2>
          <div className="rules-grid">
            <div className="rule-card">
              <div className="rule-number">1</div>
              <div className="rule-content">
                <h3>Lanzar el dado</h3>
                <p>Cada jugador lanza un dado por turno y avanza según el número obtenido.</p>
              </div>
            </div>
            
            <div className="rule-card">
              <div className="rule-number">2</div>
              <div className="rule-content">
                <h3>Escaleras</h3>
                <p>Si caes en la base de una escalera, subes automáticamente hasta la cima.</p>
              </div>
            </div>
            
            <div className="rule-card">
              <div className="rule-number">3</div>
              <div className="rule-content">
                <h3>Serpientes</h3>
                <p>Si caes en la cabeza de una serpiente, bajas hasta la cola.</p>
              </div>
            </div>
            
            <div className="rule-card">
              <div className="rule-number">4</div>
              <div className="rule-content">
                <h3>Victoria</h3>
                <p>Gana el primer jugador en llegar exactamente a la casilla 100.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mecánicas especiales */}
        <section className="instructions-section">
          <h2>🃏 Mecánicas Especiales</h2>
          <div className="special-mechanics">
            <div className="mechanic-card">
              <div className="mechanic-icon">💰</div>
              <h3>Sistema de Monedas</h3>
              <p>
                Los jugadores pueden ganar monedas virtuales durante el juego para comprar cartas especiales:
              </p>
              <ul>
                <li>Caer en casillas especiales que otorgan monedas</li>
                <li>Activar eventos aleatorios positivos</li>
                <li>Usar las monedas estratégicamente para comprar cartas</li>
                <li>Administrar eficientemente tus recursos</li>
              </ul>
            </div>
            
            <div className="mechanic-card">
              <div className="mechanic-icon">🃏</div>
              <h3>Cartas Especiales</h3>
              <p>
                Obtén cartas de dos formas: comprándolas con monedas o automáticamente cada 3 turnos:
              </p>
              <ul>
                <li><strong>Tirar 2 dados:</strong> Lanza dos dados en lugar de uno</li>
                <li><strong>Intercambiar posición:</strong> Cambia de lugar con otro jugador</li>
                <li><strong>Saltarse serpiente:</strong> Anula la próxima serpiente</li>
                <li><strong>Retroceder jugador:</strong> Hace retroceder a otro jugador</li>
              </ul>
            </div>
            
            <div className="mechanic-card">
              <div className="mechanic-icon">🎲</div>
              <h3>Sistema de Rebote</h3>
              <p>
                Mecánica especial cuando te acercas al final del tablero:
              </p>
              <ul>
                <li>Debes llegar exactamente a la casilla 100 para ganar</li>
                <li>Si el dado te hace pasar de 100, "rebotes" hacia atrás</li>
                <li>Ejemplo: estás en 98, sacas 5 → llegas a 100 y rebotes 3 casillas a la 97</li>
                <li>Esto añade estrategia a los movimientos finales</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tipos de partida */}
        <section className="instructions-section">
          <h2>🎮 Casillas Especiales y Eventos</h2>
          <div className="special-mechanics">
            <div className="mechanic-card">
              <div className="mechanic-icon">⭐</div>
              <h3>Casillas Especiales</h3>
              <p>Además de escaleras y serpientes, hay casillas que activan eventos aleatorios:</p>
              <ul>
                <li><strong>Ganar monedas:</strong> Obtienes monedas virtuales extra</li>
                <li><strong>Perder monedas:</strong> Pierdes parte de tus monedas</li>
                <li><strong>Carta gratis:</strong> Recibes una carta especial sin costo</li>
                <li><strong>Perder turno:</strong> Pierdes tu próximo turno</li>
                <li><strong>Robar carta:</strong> Robas una carta aleatoria a otro jugador</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tipos de partida */}
        <section className="instructions-section">
          <h2>🎮 Tipos de Partida</h2>
          <div className="game-types">
            <div className="type-card">
              <h3>🌍 Partidas Públicas</h3>
              <p>Cualquier jugador puede unirse libremente. Perfectas para conocer nuevos oponentes.</p>
            </div>
            
            <div className="type-card">
              <h3>🔒 Partidas Privadas</h3>
              <p>Requieren código de invitación. Ideales para jugar con amigos específicos.</p>
            </div>
          </div>
        </section>

        {/* Estrategias */}
        <section className="instructions-section">
          <h2>💡 Consejos y Estrategias</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>Gestión de Monedas</h4>
              <p>Las monedas son clave para comprar cartas estratégicas. Úsalas sabiamente en momentos críticos.</p>
            </div>
            
            <div className="tip-card">
              <h4>Cartas Automáticas</h4>
              <p>Cada 3 turnos recibes una carta gratis. Planifica su uso para maximizar su impacto.</p>
            </div>
            
            <div className="tip-card">
              <h4>Sistema de Rebote</h4>
              <p>Cerca del final, calcula cuidadosamente tus movimientos para llegar exactamente a la casilla 100.</p>
            </div>
            
            <div className="tip-card">
              <h4>Cartas de Intercambio</h4>
              <p>Usa las cartas para intercambiar posición cuando otros jugadores estén muy adelantados.</p>
            </div>
            
            <div className="tip-card">
              <h4>Casillas Especiales</h4>
              <p>Observa el tablero y trata de caer en casillas que otorguen beneficios como monedas o cartas.</p>
            </div>
            
            <div className="tip-card">
              <h4>Timing de Cartas</h4>
              <p>Guarda cartas poderosas como "Saltarse serpiente" para momentos donde realmente las necesites.</p>
            </div>
          </div>
        </section>

        {/* Controles */}
        <section className="instructions-section">
          <h2>🎯 Controles del Juego</h2>
          <div className="controls-info">
            <div className="control-item">
              <span className="control-key">Clic</span>
              <span className="control-action">Lanzar dado / Comprar carta</span>
            </div>
            <div className="control-item">
              <span className="control-key">Hover</span>
              <span className="control-action">Ver información de casillas especiales</span>
            </div>
            <div className="control-item">
              <span className="control-key">Tab</span>
              <span className="control-action">Navegar entre opciones</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="instructions-cta">
          <h2>¿Listo para jugar?</h2>
          <p>Ahora que conoces todas las reglas, ¡es hora de poner a prueba tus habilidades!</p>
          <div className="cta-buttons">
            <Link to="/partidas" className="cta-button primary">
              Ver Partidas Activas
            </Link>
            <Link to="/" className="cta-button secondary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
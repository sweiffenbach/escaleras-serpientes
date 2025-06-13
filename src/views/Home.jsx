import { Link } from 'react-router-dom';
import '../assets/styles/home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h1 className="game-title">Escaleras y Serpientes</h1>
        <p className="game-subtitle">
          El juego clásico renovado con mecánicas especiales
        </p>
        
        <div className="cta-buttons">
          <Link to="/partidas" className="cta-button primary">
            Ver partidas activas
          </Link>
          <Link to="/instructions" className="cta-button secondary">
            ¿Cómo jugar?
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Características del juego</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎲</div>
            <h3>Mecánicas clásicas</h3>
            <p>El juego tradicional que conoces y amas</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🃏</div>
            <h3>Sistema de cartas</h3>
            <p>Nuevas cartas especiales para cambiar el juego</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Multijugador</h3>
            <p>Juega con hasta 4 amigos en tiempo real</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Estadísticas</h3>
            <p>Trackea tu progreso y victorias</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-content">
          <h2>¿Listo para jugar?</h2>
          <p>
            Únete a partidas existentes o crea tu propia sala. 
            Invita a tus amigos y disfruta de este clásico juego 
            con mecánicas renovadas.
          </p>
          <Link to="/register" className="cta-button primary">
            Comenzar ahora
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

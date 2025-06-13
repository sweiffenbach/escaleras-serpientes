import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Logo/Título */}
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          🐍 Escaleras y Serpientes
        </Link>
      </div>

      {/* Links principales */}
      <div className="navbar-links">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/instructions" className="nav-link">¿Cómo jugar?</Link>
        <Link to="/about" className="nav-link">Nosotros</Link>
        
        {/* Links para usuarios autenticados */}
        {user && (
          <Link to="/partidas" className="nav-link">Ver partidas</Link>
        )}
      </div>

      {/* Sección de usuario */}
      <div className="navbar-user">
        {user ? (
          // Usuario logueado
          <div className="user-section">
            <span className="user-greeting">
              Hola, <strong>{user.nombre}</strong>
              {user.rol === 'administrador' && (
                <span className="admin-badge">Admin</span>
              )}
            </span>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          // Usuario no logueado
          <div className="auth-buttons">
            <Link to="/login" className="auth-button login-button">
              Iniciar sesión
            </Link>
            <Link to="/register" className="auth-button register-button">
              Registro
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
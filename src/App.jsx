import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Views
import Home from './views/Home';
import Instructions from './views/Instructions';
import About from './views/About';
import Login from './views/Login';
import Register from './views/Register';
import Partidas from './views/Partidas';
import Game from './views/Game';

// Services
import { verifyToken } from './services/auth';

// Styles
import './assets/styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay token al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await verifyToken();
          setUser(userData);
        } catch (error) {
          console.error('Token inválido:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/login"
              element={<Login onLogin={handleLogin} />}
            />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas */}
            <Route
              path="/partidas"
              element={
                <ProtectedRoute user={user}>
                  <Partidas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game/:id"
              element={
                <ProtectedRoute user={user}>
                  <Game />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
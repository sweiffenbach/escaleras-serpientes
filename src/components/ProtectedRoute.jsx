import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, user, requireAdmin = false }) {
  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere admin pero el usuario no es admin
  if (requireAdmin && user.rol !== 'administrador') {
    return (
      <div className="access-denied">
        <h2>Acceso Denegado</h2>
        <p>Esta sección requiere privilegios de administrador.</p>
        <p>Tu rol actual: <strong>{user.rol}</strong></p>
      </div>
    );
  }

  // Si todo está bien, mostrar el contenido
  return children;
}

export default ProtectedRoute;
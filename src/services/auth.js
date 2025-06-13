const API_BASE_URL = 'http://localhost:3000';

// Función helper para peticiones de autenticación
const authRequest = async (endpoint, data) => {
  const response = await fetch(`${API_BASE_URL}/auth${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Error en la petición');
  }
  
  return result;
};

// Función para verificar token
export const verifyToken = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No hay token');
  }

  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Token inválido');
  }
  
  return result.user;
};

// Función de registro
export const register = async (userData) => {
  const result = await authRequest('/register', userData);
  
  // Guardar token automáticamente
  localStorage.setItem('token', result.token);
  
  return result;
};

// Función de login
export const login = async (credentials) => {
  const result = await authRequest('/login', credentials);
  
  // Guardar token automáticamente
  localStorage.setItem('token', result.token);
  
  return result;
};

// Función de logout
export const logout = () => {
  localStorage.removeItem('token');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Obtener datos del usuario del token (sin verificar con servidor)
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  
  if (!token) return null;
  
  try {
    // Decodificar payload del JWT (básico, sin verificar firma)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.userId,
      email: payload.email,
      rol: payload.rol
    };
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};
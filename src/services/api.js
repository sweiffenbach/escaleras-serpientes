// Configuración base para API - URL fija para desarrollo
const API_BASE_URL ='https://escalerasandserpientes.onrender.com';

// Función helper para hacer peticiones con autenticación
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`🌐 API Request: ${config.method || 'GET'} ${API_BASE_URL}${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    console.log(`📡 API Response: ${response.status} ${response.statusText}`);

    // Si el token expiró, redirigir al login
    if (response.status === 401) {
      console.log('🔐 Token expirado, redirigiendo al login');
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
      throw new Error('Token expirado. Por favor, inicia sesión nuevamente.');
    }

    // Si el servidor está caído o no responde
    if (response.status >= 500) {
      throw new Error('Error del servidor. Intenta nuevamente más tarde.');
    }

    const data = await response.json();
    console.log('📊 API Data:', data);

    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('❌ API Error:', error);

    // Si es un error de red (servidor no responde)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifica que el backend esté corriendo en http://localhost:3000');
    }

    // Re-lanzar otros errores
    throw error;
  }
};

// Funciones específicas para diferentes endpoints
export const api = {
  // ===== USUARIOS =====
  getUsers: () => apiRequest('/usuarios'),
  getUser: (id) => apiRequest(`/usuarios/${id}`),
  updateUser: (id, data) => apiRequest(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteUser: (id) => apiRequest(`/usuarios/${id}`, {
    method: 'DELETE',
  }),

  // ===== PARTIDAS =====
  getPartidas: () => {
    console.log('🎮 Obteniendo lista de partidas...');
    return apiRequest('/partidas');
  },

  getPartida: (id) => {
    console.log(`🎮 Obteniendo partida ${id}...`);
    return apiRequest(`/partidas/${id}`);
  },

  createPartida: (data) => {
    console.log('🆕 Creando nueva partida:', data);
    return apiRequest('/partidas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deletePartida: (id) => {
    console.log(`🗑️ Eliminando partida ${id}...`);
    return apiRequest(`/partidas/${id}`, {
      method: 'DELETE',
    });
  },

  startPartida: (id) => {
    console.log(`🚀 Iniciando partida ${id}...`);
    return apiRequest(`/partidas/${id}/encurso`, {
      method: 'PUT',
    });
  },

  // ===== JUGADOR PARTIDA =====
  joinPartida: (data) => {
    console.log('🎯 Uniéndose a partida:', data);
    return apiRequest('/jugadorPartida', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  leavePartida: (partidaId, usuarioId) => {
    console.log(`🚪 Saliendo de partida ${partidaId}...`);
    return apiRequest(`/jugadorPartida`, {
      method: 'DELETE',
      body: JSON.stringify({ PartidaID: partidaId, UsuarioID: usuarioId }),
    });
  },

  getPlayerPosition: (playerId) => apiRequest(`/jugadorPartida/${playerId}/posicion`),

  updatePlayerPosition: (playerId, posicion) => apiRequest(`/jugadorPartida/${playerId}/posicion`, {
    method: 'PUT',
    body: JSON.stringify({ PosicionActual: posicion }),
  }),

  // ===== JUEGO (MECÁNICAS PRINCIPALES) =====
  getGameState: (partidaId) => {
    if (!partidaId || partidaId === 'undefined') {
      throw new Error('ID de partida inválido');
    }
    console.log(`🎲 Obteniendo estado del juego ${partidaId}...`);
    return apiRequest(`/juego/${partidaId}/estado`);
  },

  rollDice: (partidaId, usuarioId) => {
    if (!partidaId || !usuarioId) {
      throw new Error('Parámetros inválidos para lanzar dado');
    }
    console.log(`🎲 Lanzando dado en partida ${partidaId} para usuario ${usuarioId}...`);
    return apiRequest(`/juego/${partidaId}/lanzar-dado`, {
      method: 'POST',
      body: JSON.stringify({ usuarioId }),
    });
  },

  getPlayerCards: (partidaId, usuarioId) => {
    if (!partidaId || !usuarioId) {
      throw new Error('Parámetros inválidos para obtener cartas');
    }
    console.log(`🃏 Obteniendo cartas del jugador ${usuarioId} en partida ${partidaId}...`);
    return apiRequest(`/juego/${partidaId}/cartas/${usuarioId}`);
  },

  buyCard: (partidaId, usuarioId) => {
    if (!partidaId || !usuarioId) {
      throw new Error('Parámetros inválidos para comprar carta');
    }
    console.log(`💰 Comprando carta en partida ${partidaId} para usuario ${usuarioId}...`);
    return apiRequest(`/juego/${partidaId}/comprar-carta`, {
      method: 'POST',
      body: JSON.stringify({ usuarioId }),
    });
  },

  useCard: (partidaId, usuarioId, cardId, targetData = {}) => {
    if (!partidaId || !usuarioId || !cardId) {
      throw new Error('Parámetros inválidos para usar carta');
    }
    console.log(`🃏 Usando carta ${cardId} en partida ${partidaId}...`);
    return apiRequest(`/juego/${partidaId}/usar-carta`, {
      method: 'POST',
      body: JSON.stringify({
        usuarioId,
        cartaId: cardId,
        ...targetData
      }),
    });
  },

  // ===== ESTADÍSTICAS =====
  getPlayerStats: (usuarioId) => apiRequest(`/usuarios/${usuarioId}/estadisticas`),
  getGameHistory: (usuarioId) => apiRequest(`/usuarios/${usuarioId}/historial`),

  // ===== SISTEMA DE SALUD =====
  healthCheck: () => {
    console.log('🏥 Verificando salud del API...');
    return apiRequest('/');
  },

  // ===== TESTING - SOLO DESARROLLO =====
  testConnection: async () => {
    try {
      console.log('🧪 Probando conexión con backend...');
      const response = await fetch(API_BASE_URL);
      const text = await response.text();
      console.log('✅ Conexión exitosa:', text);
      return { success: true, message: text };
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      throw new Error('No se puede conectar al backend en http://localhost:3000');
    }
  }
};

// Helper para verificar si el API está disponible
export const checkApiHealth = async () => {
  try {
    console.log('🏥 Verificando salud del API...');
    await api.testConnection();
    return true;
  } catch (error) {
    console.error('💔 API health check failed:', error);
    return false;
  }
};

// Helper para obtener la URL base
export const getApiBaseUrl = () => API_BASE_URL;

// Verificar conexión al cargar el módulo
console.log(`🌐 API configurado para: ${API_BASE_URL}`);

export default api;
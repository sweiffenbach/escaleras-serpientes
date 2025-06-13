// Configuración del API
export const API_BASE_URL = 'http://localhost:3000';

// Configuración del juego
export const GAME_CONFIG = {
  BOARD_SIZE: 100,
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  DICE_SIDES: 6,
  INITIAL_COINS: 5,
  CARDS_PER_3_TURNS: 1,
  AUTO_CARD_TURNS: 3,
};

// Tipos de cartas especiales
export const CARD_TYPES = {
  DOUBLE_DICE: 'doble_dado',
  SWAP_POSITION: 'intercambiar_posicion',
  SKIP_SNAKE: 'saltar_serpiente',
  MAKE_RETREAT: 'retroceder_turno',
};

// Descripciones de cartas
export const CARD_DESCRIPTIONS = {
  [CARD_TYPES.DOUBLE_DICE]: 'Lanza dos dados en lugar de uno',
  [CARD_TYPES.SWAP_POSITION]: 'Intercambia posición con otro jugador',
  [CARD_TYPES.SKIP_SNAKE]: 'Anula el efecto de la próxima serpiente',
  [CARD_TYPES.MAKE_RETREAT]: 'Hace retroceder a otro jugador',
};

// Estados de partida
export const GAME_STATES = {
  WAITING: 'en_espera',
  IN_PROGRESS: 'en_curso',
  FINISHED: 'finalizada',
};

// Estados de usuario
export const USER_STATES = {
  ACTIVE: 'activo',
  SUSPENDED: 'suspendido',
  INACTIVE: 'inactivo',
};

// Roles de usuario
export const USER_ROLES = {
  PLAYER: 'jugador',
  ADMIN: 'administrador',
  MODERATOR: 'moderador',
};

// Tipos de partida
export const GAME_TYPES = {
  PUBLIC: 'pública',
  PRIVATE: 'privada',
};

// Tipos de casillas especiales
export const SPECIAL_CELL_TYPES = {
  GAIN_COINS: 'ganar_monedas',
  LOSE_COINS: 'perder_monedas',
  FREE_CARD: 'carta_gratis',
  LOSE_TURN: 'perder_turno',
  STEAL_CARD: 'robar_carta',
};

// Configuración de escaleras (casilla inicio -> casilla fin)
export const LADDERS = {
  1: 38,   4: 14,   9: 31,   16: 6,   21: 42,
  28: 84,  36: 44,  48: 26,  51: 67,  62: 19,
  64: 60,  71: 91,  80: 100, 87: 24,  93: 73,
  95: 75,  98: 78
};

// Configuración de serpientes (casilla cabeza -> casilla cola)
export const SNAKES = {
  6: 16,   23: 8,   34: 1,   47: 25,  56: 19,
  68: 50,  75: 53,  83: 45,  85: 59,  90: 48,
  92: 25,  97: 87,  99: 63
};

// Tipos de movimiento
export const MOVEMENT_TYPES = {
  DICE: 'dado',
  LADDER: 'escalera',
  SNAKE: 'serpiente',
  CARD: 'carta',
  SPECIAL_EVENT: 'evento_especial',
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  INVALID_CREDENTIALS: 'Credenciales inválidas.',
  GAME_FULL: 'La partida está llena.',
  NOT_YOUR_TURN: 'No es tu turno.',
  INSUFFICIENT_COINS: 'No tienes suficientes monedas.',
  NO_CARDS: 'No tienes cartas disponibles.',
  INVALID_MOVE: 'Movimiento inválido.',
  GAME_NOT_FOUND: 'Partida no encontrada.',
  USER_NOT_FOUND: 'Usuario no encontrado.',
  UNAUTHORIZED: 'No autorizado.',
  TOKEN_EXPIRED: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: '¡Registro exitoso!',
  LOGIN_SUCCESS: '¡Bienvenido!',
  GAME_CREATED: 'Partida creada exitosamente.',
  JOINED_GAME: 'Te has unido a la partida.',
  CARD_PURCHASED: 'Carta comprada exitosamente.',
  CARD_USED: 'Carta usada exitosamente.',
  MOVE_COMPLETED: 'Movimiento completado.',
};

// Configuración de tiempo (en milisegundos)
export const TIMEOUTS = {
  API_TIMEOUT: 10000, // 10 segundos
  GAME_UPDATE_INTERVAL: 3000, // 3 segundos
  DICE_ANIMATION: 1500, // 1.5 segundos
  MOVE_ANIMATION: 2000, // 2 segundos
  NOTIFICATION_DISPLAY: 5000, // 5 segundos
};

// Configuración de límites
export const LIMITS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_USERNAME_LENGTH: 50,
  MAX_GAME_NAME_LENGTH: 100,
  MAX_INVITATION_CODE_LENGTH: 10,
};

// URLs de assets
export const ASSETS = {
  DEFAULT_AVATAR: '/assets/default-avatar.png',
  GAME_LOGO: '/assets/logo.png',
  DICE_IMAGES: {
    1: '/assets/dice-1.png',
    2: '/assets/dice-2.png',
    3: '/assets/dice-3.png',
    4: '/assets/dice-4.png',
    5: '/assets/dice-5.png',
    6: '/assets/dice-6.png',
  },
};

// Configuración de LocalStorage
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  GAME_SETTINGS: 'game_settings',
  THEME: 'theme_preference',
};

// Eventos de WebSocket (para uso futuro)
export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_GAME: 'join_game',
  LEAVE_GAME: 'leave_game',
  DICE_ROLL: 'dice_roll',
  MOVE_PLAYER: 'move_player',
  USE_CARD: 'use_card',
  BUY_CARD: 'buy_card',
  GAME_UPDATE: 'game_update',
  TURN_CHANGE: 'turn_change',
  GAME_END: 'game_end',
  CHAT_MESSAGE: 'chat_message',
  ERROR: 'error',
};

// Colores del tema
export const THEME_COLORS = {
  PRIMARY: '#00694f',
  PRIMARY_HOVER: '#004c3c',
  SECONDARY: '#b22222',
  BACKGROUND_CREAM: '#f5f5dc',
  BACKGROUND_LIGHT: '#fffbe6',
  SUCCESS: '#28a745',
  ERROR: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  INSTRUCTIONS: '/instructions',
  ABOUT: '/about',
  PARTIDAS: '/partidas',
  GAME: '/game/:id',
  PROFILE: '/profile',
  ADMIN: '/admin',
};
-- Crear tipos ENUM
CREATE TYPE usuario_estado AS ENUM ('activo', 'suspendido', 'inactivo');
CREATE TYPE usuario_rol AS ENUM ('jugador', 'administrador', 'moderador');
CREATE TYPE partida_tipo AS ENUM ('pública', 'privada');
CREATE TYPE partida_estado AS ENUM ('en_espera', 'en_curso', 'finalizada');
CREATE TYPE jugador_estado AS ENUM ('activo', 'abandonó');
CREATE TYPE carta_tipo AS ENUM ('doble_dado', 'intercambiar_posicion', 'saltar_serpiente', 'retroceder_turno');
CREATE TYPE obtencion_carta AS ENUM ('compra', 'gratuita', 'evento');
CREATE TYPE casilla_tipo AS ENUM ('ganar_monedas', 'perder_monedas', 'carta_gratis', 'perder_turno', 'robar_carta');
CREATE TYPE movimiento_tipo AS ENUM ('dado', 'escalera', 'serpiente', 'carta', 'evento_especial');

-- Tabla Usuario
CREATE TABLE Usuario (
    UsuarioID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    NombreUsuario VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Contraseña VARCHAR(255) NOT NULL,
    Avatar VARCHAR(255),
    FechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UltimaConexion TIMESTAMP,
    Estado usuario_estado NOT NULL DEFAULT 'activo',
    Rol usuario_rol NOT NULL DEFAULT 'jugador'
);

-- Tabla Partida
CREATE TABLE Partida (
    PartidaID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Nombre VARCHAR(100) NOT NULL,
    Tipo partida_tipo NOT NULL DEFAULT 'pública',
    CodigoInvitacion VARCHAR(10),
    EstadoPartida partida_estado NOT NULL DEFAULT 'en_espera',
    MaxJugadores INTEGER NOT NULL DEFAULT 4,
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaInicio TIMESTAMP,
    FechaFin TIMESTAMP,
    TiempoEspera INTEGER NOT NULL DEFAULT 600, -- 10 minutos en segundos
    PropietarioID UUID NOT NULL,
    FOREIGN KEY (PropietarioID) REFERENCES Usuario(UsuarioID) ON DELETE CASCADE
);

-- Tabla JugadorPartida
CREATE TABLE JugadorPartida (
    JugadorPartidaID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UsuarioID UUID NOT NULL,
    PartidaID UUID NOT NULL,
    PosicionActual INTEGER NOT NULL DEFAULT 1,
    Monedas INTEGER NOT NULL DEFAULT 0,
    EnTurno BOOLEAN NOT NULL DEFAULT FALSE,
    Orden INTEGER NOT NULL,
    Estado jugador_estado NOT NULL DEFAULT 'activo',
    UltimoTurno TIMESTAMP,
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(UsuarioID) ON DELETE CASCADE,
    FOREIGN KEY (PartidaID) REFERENCES Partida(PartidaID) ON DELETE CASCADE,
    UNIQUE(UsuarioID, PartidaID) -- Un usuario solo puede estar una vez en cada partida
);

-- Tabla Carta
CREATE TABLE Carta (
    CartaID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Tipo carta_tipo NOT NULL,
    Descripcion TEXT NOT NULL,
    CostoMonedas INTEGER NOT NULL DEFAULT 10,
    IconoURL VARCHAR(255)
);

-- Tabla Tablero
CREATE TABLE Tablero (
    TableroID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    PartidaID UUID NOT NULL UNIQUE,
    Configuracion JSONB NOT NULL, -- Almacena ubicación de escaleras, serpientes, etc.
    FOREIGN KEY (PartidaID) REFERENCES Partida(PartidaID) ON DELETE CASCADE
);

-- Tabla CasillaEspecial
CREATE TABLE CasillaEspecial (
    CasillaEspecialID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    TableroID UUID NOT NULL,
    Posicion INTEGER NOT NULL CHECK (Posicion BETWEEN 1 AND 100),
    Tipo casilla_tipo NOT NULL,
    Valor INTEGER,
    Descripcion TEXT,
    FOREIGN KEY (TableroID) REFERENCES Tablero(TableroID) ON DELETE CASCADE,
    UNIQUE(TableroID, Posicion) -- Una posición solo puede tener una casilla especial en un tablero
);

-- Tabla CartaJugador
CREATE TABLE CartaJugador (
    CartaJugadorID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    JugadorPartidaID UUID NOT NULL,
    CartaID UUID NOT NULL,
    ObtenidasPor obtencion_carta NOT NULL,
    FechaObtencion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaUso TIMESTAMP,
    Activa BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (JugadorPartidaID) REFERENCES JugadorPartida(JugadorPartidaID) ON DELETE CASCADE,
    FOREIGN KEY (CartaID) REFERENCES Carta(CartaID) ON DELETE CASCADE
);

-- Tabla MovimientoJugador
CREATE TABLE MovimientoJugador (
    MovimientoID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    JugadorPartidaID UUID NOT NULL,
    TipoMovimiento movimiento_tipo NOT NULL,
    PosicionInicial INTEGER NOT NULL CHECK (PosicionInicial BETWEEN 1 AND 100),
    PosicionFinal INTEGER NOT NULL CHECK (PosicionFinal BETWEEN 1 AND 100),
    ValorDado INTEGER CHECK (ValorDado BETWEEN 1 AND 6),
    CartaUsadaID UUID,
    FechaMovimiento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TurnoNumero INTEGER NOT NULL,
    FOREIGN KEY (JugadorPartidaID) REFERENCES JugadorPartida(JugadorPartidaID) ON DELETE CASCADE,
    FOREIGN KEY (CartaUsadaID) REFERENCES CartaJugador(CartaJugadorID) ON DELETE SET NULL
);

-- Tabla TiendaPartida
CREATE TABLE TiendaPartida (
    TiendaID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    PartidaID UUID NOT NULL,
    CartaID UUID NOT NULL,
    DisponibleDesde TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DisponibleHasta TIMESTAMP,
    FOREIGN KEY (PartidaID) REFERENCES Partida(PartidaID) ON DELETE CASCADE,
    FOREIGN KEY (CartaID) REFERENCES Carta(CartaID) ON DELETE CASCADE
);

-- Tabla Estadistica
CREATE TABLE Estadistica (
    EstadisticaID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UsuarioID UUID NOT NULL UNIQUE,
    PartidasJugadas INTEGER NOT NULL DEFAULT 0,
    PartidasGanadas INTEGER NOT NULL DEFAULT 0,
    PartidasAbandonadas INTEGER NOT NULL DEFAULT 0,
    MayorPosicion INTEGER NOT NULL DEFAULT 0,
    TotalMonedas INTEGER NOT NULL DEFAULT 0,
    TotalCartasUsadas INTEGER NOT NULL DEFAULT 0,
    TurnosJugados INTEGER NOT NULL DEFAULT 0,
    UltimaActualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(UsuarioID) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_jugador_partida_partida ON JugadorPartida(PartidaID);
CREATE INDEX idx_jugador_partida_usuario ON JugadorPartida(UsuarioID);
CREATE INDEX idx_carta_jugador_jugador ON CartaJugador(JugadorPartidaID);
CREATE INDEX idx_movimiento_jugador ON MovimientoJugador(JugadorPartidaID);
CREATE INDEX idx_casilla_especial_tablero ON CasillaEspecial(TableroID);
CREATE INDEX idx_tienda_partida ON TiendaPartida(PartidaID);

-- Trigger para actualizar UltimaConexion cuando un usuario se conecta
CREATE OR REPLACE FUNCTION actualizar_ultima_conexion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Usuario SET UltimaConexion = CURRENT_TIMESTAMP WHERE UsuarioID = NEW.UsuarioID;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_conexion
AFTER INSERT ON JugadorPartida
FOR EACH ROW
EXECUTE FUNCTION actualizar_ultima_conexion();

-- Trigger para actualizar estadísticas cuando finaliza una partida
CREATE OR REPLACE FUNCTION actualizar_estadisticas_partida()
RETURNS TRIGGER AS $$
BEGIN
    -- Si la partida ha finalizado
    IF NEW.EstadoPartida = 'finalizada' AND OLD.EstadoPartida != 'finalizada' THEN
        -- Actualizar estadísticas para todos los jugadores de la partida
        UPDATE Estadistica e
        SET 
            PartidasJugadas = PartidasJugadas + 1,
            UltimaActualizacion = CURRENT_TIMESTAMP,
            -- Actualizar partidas ganadas si el jugador llegó a la casilla 100
            PartidasGanadas = PartidasGanadas + (
                SELECT CASE WHEN jp.PosicionActual = 100 THEN 1 ELSE 0 END
                FROM JugadorPartida jp
                WHERE jp.PartidaID = NEW.PartidaID AND jp.UsuarioID = e.UsuarioID
            ),
            -- Actualizar partidas abandonadas
            PartidasAbandonadas = PartidasAbandonadas + (
                SELECT CASE WHEN jp.Estado = 'abandonó' THEN 1 ELSE 0 END
                FROM JugadorPartida jp
                WHERE jp.PartidaID = NEW.PartidaID AND jp.UsuarioID = e.UsuarioID
            ),
            -- Actualizar mayor posición alcanzada
            MayorPosicion = GREATEST(MayorPosicion, (
                SELECT jp.PosicionActual
                FROM JugadorPartida jp
                WHERE jp.PartidaID = NEW.PartidaID AND jp.UsuarioID = e.UsuarioID
            )),
            -- Actualizar total de monedas acumuladas
            TotalMonedas = TotalMonedas + (
                SELECT jp.Monedas
                FROM JugadorPartida jp
                WHERE jp.PartidaID = NEW.PartidaID AND jp.UsuarioID = e.UsuarioID
            ),
            -- Actualizar total de cartas usadas
            TotalCartasUsadas = TotalCartasUsadas + (
                SELECT COUNT(*)
                FROM CartaJugador cj
                JOIN JugadorPartida jp ON jp.JugadorPartidaID = cj.JugadorPartidaID
                WHERE jp.PartidaID = NEW.PartidaID AND jp.UsuarioID = e.UsuarioID AND cj.FechaUso IS NOT NULL
            ),
            -- Actualizar total de turnos jugados
            TurnosJugados = TurnosJugados + (
                SELECT COUNT(*)
                FROM MovimientoJugador mj
                JOIN JugadorPartida jp ON jp.JugadorPartidaID = mj.JugadorPartidaID
                WHERE jp.PartidaID = NEW.PartidaID AND jp.UsuarioID = e.UsuarioID
            )
        FROM JugadorPartida jp
        WHERE jp.PartidaID = NEW.PartidaID AND jp.UsuarioID = e.UsuarioID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_estadisticas
AFTER UPDATE ON Partida
FOR EACH ROW
EXECUTE FUNCTION actualizar_estadisticas_partida();
-- Tabla de servicios
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    prefix VARCHAR(5) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    estimated_time INTEGER DEFAULT 10, -- en minutos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de operadores
CREATE TABLE IF NOT EXISTS operators (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    position VARCHAR(50),
    role VARCHAR(20) DEFAULT 'operator', -- 'operator', 'supervisor', 'admin'
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de turnos/tickets
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    number VARCHAR(10) NOT NULL,
    service_id INTEGER REFERENCES services(id),
    status VARCHAR(20) DEFAULT 'waiting', -- 'waiting', 'called', 'in_progress', 'completed', 'cancelled'
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    operator_id INTEGER REFERENCES operators(id),
    estimated_wait_time INTEGER, -- en minutos
    actual_wait_time INTEGER, -- en minutos
    mobile_phone VARCHAR(20),
    notification_sent BOOLEAN DEFAULT false
);

-- Tabla de configuraciones del sistema
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de sesiones de atención (para reportes)
CREATE TABLE IF NOT EXISTS attention_sessions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    operator_id INTEGER REFERENCES operators(id),
    tickets_attended INTEGER DEFAULT 0,
    total_time_minutes INTEGER DEFAULT 0,
    average_time_minutes DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de métricas diarias
CREATE TABLE IF NOT EXISTS daily_metrics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_tickets INTEGER DEFAULT 0,
    completed_tickets INTEGER DEFAULT 0,
    cancelled_tickets INTEGER DEFAULT 0,
    average_wait_time DECIMAL(5,2) DEFAULT 0,
    peak_hour INTEGER, -- hora pico (0-23)
    service_level_percentage DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_service ON tickets(service_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date);

-- Database Schema for Campeonato La Vizcacha

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL, -- VIZ-2026-001
  name VARCHAR(50) NOT NULL,
  category VARCHAR(20) CHECK (category IN ('Pareja', 'Trio')),
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  institution VARCHAR(100),
  photo_url TEXT,
  status VARCHAR(20) DEFAULT 'inscripto' CHECK (status IN ('inscripto', 'pagado', 'checkin', 'rechazado')),
  qr_code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age INTEGER,
  phone VARCHAR(20),
  email VARCHAR(100),
  level VARCHAR(20) CHECK (level IN ('Principiante', 'Intermedio', 'Avanzado')),
  dni VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS rounds (
  id SERIAL PRIMARY KEY,
  number INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  start_time TIMESTAMP,
  end_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  round_id INTEGER REFERENCES rounds(id),
  team_home_id INTEGER REFERENCES teams(id),
  team_away_id INTEGER REFERENCES teams(id), -- Nullable for BYE
  table_number INTEGER,
  score_home INTEGER DEFAULT 0,
  score_away INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
  start_time TIMESTAMP,
  end_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT
);

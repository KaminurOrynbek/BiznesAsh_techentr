CREATE TABLE IF NOT EXISTS expert_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    specialization TEXT,
    price_per_session DECIMAL(12, 2) DEFAULT 25000,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultation_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    expert_id UUID NOT NULL,
    expert_name TEXT,
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'COMPLETED', 'CANCELLED'
    scheduled_at TIMESTAMP NOT NULL,
    meeting_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON consultation_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_expert_id ON consultation_bookings(expert_id);

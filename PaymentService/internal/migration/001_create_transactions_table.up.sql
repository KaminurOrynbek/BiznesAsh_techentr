CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KZT',
    reference_type VARCHAR(20) NOT NULL, -- 'SUBSCRIPTION', 'CONSULTATION'
    reference_id UUID NOT NULL,          -- ID of the sub or booking
    status VARCHAR(20) NOT NULL,         -- 'PENDING', 'SUCCESS', 'FAILED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);

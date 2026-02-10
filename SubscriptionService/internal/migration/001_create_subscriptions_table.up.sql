CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    plan_type VARCHAR(20) NOT NULL, -- 'BASIC', 'PRO'
    status VARCHAR(20) NOT NULL,    -- 'ACTIVE', 'CANCELED', 'EXPIRED'
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscription_plans_user_id ON subscription_plans(user_id);

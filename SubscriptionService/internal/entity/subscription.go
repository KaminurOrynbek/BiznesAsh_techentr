package entity

import (
	"time"
)

type Subscription struct {
	ID        string    `db:"id"`
	UserID    string    `db:"user_id"`
	PlanType  string    `db:"plan_type"` // BASIC, PRO
	Status    string    `db:"status"`    // ACTIVE, CANCELED, EXPIRED
	StartsAt  time.Time `db:"starts_at"`
	EndsAt    time.Time `db:"ends_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

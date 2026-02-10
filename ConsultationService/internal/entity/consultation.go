package entity

import (
	"database/sql"
	"time"
)

type ExpertProfile struct {
	ID              string    `db:"id"`
	UserID          string    `db:"user_id"`
	Specialization  string    `db:"specialization"`
	PricePerSession float64   `db:"price_per_session"`
	IsAvailable     bool      `db:"is_available"`
	CreatedAt       time.Time `db:"created_at"`
}

type ConsultationBooking struct {
	ID          string         `db:"id"`
	UserID      string         `db:"user_id"`
	ExpertID    string         `db:"expert_id"`
	ExpertName  sql.NullString `db:"expert_name"`
	Status      string         `db:"status"` // PENDING, PAID, COMPLETED, CANCELLED
	ScheduledAt time.Time      `db:"scheduled_at"`
	MeetingLink string         `db:"meeting_link"`
	CreatedAt   time.Time      `db:"created_at"`
}

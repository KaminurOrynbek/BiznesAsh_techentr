package entity

import (
	"time"
)

type Transaction struct {
	ID            string    `db:"id"`
	UserID        string    `db:"user_id"`
	Amount        float64   `db:"amount"`
	Currency      string    `db:"currency"`
	ReferenceType string    `db:"reference_type"` // SUBSCRIPTION, CONSULTATION
	ReferenceID   string    `db:"reference_id"`
	Status        string    `db:"status"` // PENDING, SUCCESS, FAILED
	CreatedAt     time.Time `db:"created_at"`
}

package repository

import (
	"context"
	"fmt"
	"github.com/KaminurOrynbek/BiznesAsh/ConsultationService/internal/entity"
	"github.com/jmoiron/sqlx"
)

type ConsultationDAO struct {
	db *sqlx.DB
}

func NewConsultationDAO(db *sqlx.DB) *ConsultationDAO {
	return &ConsultationDAO{db: db}
}

func (d *ConsultationDAO) CreateExpert(ctx context.Context, expert *entity.ExpertProfile) error {
	query := `
		INSERT INTO expert_profiles (id, user_id, specialization, price_per_session, is_available, created_at)
		VALUES (:id, :user_id, :specialization, :price_per_session, :is_available, :created_at)
	`
	_, err := d.db.NamedExecContext(ctx, query, expert)
	if err != nil {
		return fmt.Errorf("failed to create expert profile: %v", err)
	}
	return nil
}

func (d *ConsultationDAO) ListExperts(ctx context.Context) ([]*entity.ExpertProfile, error) {
	var experts []*entity.ExpertProfile
	query := `SELECT * FROM expert_profiles WHERE is_available = true`
	err := d.db.SelectContext(ctx, &experts, query)
	if err != nil {
		return nil, err
	}
	return experts, nil
}

func (d *ConsultationDAO) CreateBooking(ctx context.Context, booking *entity.ConsultationBooking) error {
	query := `
		INSERT INTO consultation_bookings (id, user_id, expert_id, expert_name, status, scheduled_at, meeting_link, created_at)
		VALUES (:id, :user_id, :expert_id, :expert_name, :status, :scheduled_at, :meeting_link, :created_at)
	`
	_, err := d.db.NamedExecContext(ctx, query, booking)
	if err != nil {
		return fmt.Errorf("failed to create booking: %v", err)
	}
	return nil
}

func (d *ConsultationDAO) UpdateBookingStatus(ctx context.Context, id, status string) error {
	query := `UPDATE consultation_bookings SET status = $1 WHERE id = $2`
	_, err := d.db.ExecContext(ctx, query, status, id)
	return err
}

func (d *ConsultationDAO) GetBookingByID(ctx context.Context, id string) (*entity.ConsultationBooking, error) {
	var booking entity.ConsultationBooking
	query := `SELECT * FROM consultation_bookings WHERE id = $1`
	err := d.db.GetContext(ctx, &booking, query, id)
	if err != nil {
		return nil, err
	}
	return &booking, nil
}

func (d *ConsultationDAO) ListUserBookings(ctx context.Context, userID string) ([]*entity.ConsultationBooking, error) {
	var bookings []*entity.ConsultationBooking
	query := `SELECT * FROM consultation_bookings WHERE user_id = $1 ORDER BY scheduled_at DESC`
	err := d.db.SelectContext(ctx, &bookings, query, userID)
	return bookings, err
}

func (d *ConsultationDAO) HasActiveBooking(ctx context.Context, userID, expertID string) (bool, error) {
	var count int
	query := `SELECT count(*) FROM consultation_bookings WHERE user_id = $1 AND expert_id = $2 AND status IN ('PENDING', 'PAID')`
	err := d.db.GetContext(ctx, &count, query, userID, expertID)
	return count > 0, err
}

func (d *ConsultationDAO) UpdateBooking(ctx context.Context, booking *entity.ConsultationBooking) error {
	query := `
		UPDATE consultation_bookings 
		SET status = :status, scheduled_at = :scheduled_at, meeting_link = :meeting_link
		WHERE id = :id
	`
	_, err := d.db.NamedExecContext(ctx, query, booking)
	return err
}

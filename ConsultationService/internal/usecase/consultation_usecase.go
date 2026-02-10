package usecase

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/KaminurOrynbek/BiznesAsh/ConsultationService/internal/entity"
	"github.com/google/uuid"
)

type ConsultationRepo interface {
	CreateExpert(ctx context.Context, expert *entity.ExpertProfile) error
	ListExperts(ctx context.Context) ([]*entity.ExpertProfile, error)
	CreateBooking(ctx context.Context, booking *entity.ConsultationBooking) error
	UpdateBookingStatus(ctx context.Context, id, status string) error
	UpdateBooking(ctx context.Context, booking *entity.ConsultationBooking) error
	GetBookingByID(ctx context.Context, id string) (*entity.ConsultationBooking, error)
	ListUserBookings(ctx context.Context, userID string) ([]*entity.ConsultationBooking, error)
	HasActiveBooking(ctx context.Context, userID, expertID string) (bool, error)
}

type ConsultationUsecase struct {
	repo ConsultationRepo
}

func NewConsultationUsecase(repo ConsultationRepo) *ConsultationUsecase {
	return &ConsultationUsecase{repo: repo}
}

func (u *ConsultationUsecase) RegisterExpert(ctx context.Context, userID, specialization string, price float64) (*entity.ExpertProfile, error) {
	expert := &entity.ExpertProfile{
		ID:              uuid.New().String(),
		UserID:          userID,
		Specialization:  specialization,
		PricePerSession: price,
		IsAvailable:     true,
		CreatedAt:       time.Now(),
	}
	err := u.repo.CreateExpert(ctx, expert)
	if err != nil {
		return nil, err
	}
	return expert, nil
}

func (u *ConsultationUsecase) ListExperts(ctx context.Context) ([]*entity.ExpertProfile, error) {
	return u.repo.ListExperts(ctx)
}

func (u *ConsultationUsecase) CreateBooking(ctx context.Context, userID, expertID, expertName string, scheduledAt time.Time) (*entity.ConsultationBooking, error) {
	// Check for existing active booking with this expert
	hasActive, err := u.repo.HasActiveBooking(ctx, userID, expertID)
	if err != nil {
		return nil, err
	}
	if hasActive {
		return nil, fmt.Errorf("user already has an active booking with this expert")
	}

	booking := &entity.ConsultationBooking{
		ID:          uuid.New().String(),
		UserID:      userID,
		ExpertID:    expertID,
		ExpertName:  sql.NullString{String: expertName, Valid: expertName != ""},
		Status:      "PENDING",
		ScheduledAt: scheduledAt,
		MeetingLink: "https://zoom.us/mock-link", // Mock link
		CreatedAt:   time.Now(),
	}
	err = u.repo.CreateBooking(ctx, booking)
	if err != nil {
		return nil, err
	}
	return booking, nil
}

func (u *ConsultationUsecase) CancelBooking(ctx context.Context, id string) (*entity.ConsultationBooking, error) {
	existing, err := u.repo.GetBookingByID(ctx, id)
	if err != nil {
		return nil, err
	}
	existing.Status = "CANCELLED"
	err = u.repo.UpdateBooking(ctx, existing)
	return existing, err
}

func (u *ConsultationUsecase) GetUserBookings(ctx context.Context, userID string) ([]*entity.ConsultationBooking, error) {
	return u.repo.ListUserBookings(ctx, userID)
}

func (u *ConsultationUsecase) ConfirmPayment(ctx context.Context, bookingID string) error {
	return u.repo.UpdateBookingStatus(ctx, bookingID, "PAID")
}

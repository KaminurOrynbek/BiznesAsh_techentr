package usecase

import (
	"context"
	"time"

	"github.com/KaminurOrynbek/BiznesAsh/PaymentService/internal/entity"
	"github.com/google/uuid"
)

type TransactionRepo interface {
	Create(ctx context.Context, tx *entity.Transaction) error
	GetByUserID(ctx context.Context, userID string) ([]*entity.Transaction, error)
}

type PaymentUsecase struct {
	repo TransactionRepo
}

func NewPaymentUsecase(repo TransactionRepo) *PaymentUsecase {
	return &PaymentUsecase{repo: repo}
}

func (u *PaymentUsecase) ProcessPayment(ctx context.Context, userID string, amount float64, currency, refType, refID string) (*entity.Transaction, error) {
	tx := &entity.Transaction{
		ID:            uuid.New().String(),
		UserID:        userID,
		Amount:        amount,
		Currency:      currency,
		ReferenceType: refType,
		ReferenceID:   refID,
		Status:        "SUCCESS", // Mocked as success for now
		CreatedAt:     time.Now(),
	}

	err := u.repo.Create(ctx, tx)
	if err != nil {
		return nil, err
	}

	return tx, nil
}

func (u *PaymentUsecase) GetHistory(ctx context.Context, userID string) ([]*entity.Transaction, error) {
	return u.repo.GetByUserID(ctx, userID)
}

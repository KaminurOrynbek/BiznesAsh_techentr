package usecase

import (
	"context"
	"time"

	"github.com/KaminurOrynbek/BiznesAsh/SubscriptionService/internal/entity"
	"github.com/google/uuid"
)

type SubscriptionRepo interface {
	Create(ctx context.Context, sub *entity.Subscription) error
	GetByID(ctx context.Context, id string) (*entity.Subscription, error)
	GetByUserID(ctx context.Context, userID string) (*entity.Subscription, error)
	GetByUserIDHistory(ctx context.Context, userID string) ([]*entity.Subscription, error)
	Update(ctx context.Context, sub *entity.Subscription) error
	List(ctx context.Context) ([]*entity.Subscription, error)
}

type SubscriptionUsecase struct {
	repo SubscriptionRepo
}

func NewSubscriptionUsecase(repo SubscriptionRepo) *SubscriptionUsecase {
	return &SubscriptionUsecase{repo: repo}
}

func (u *SubscriptionUsecase) GetSubscription(ctx context.Context, userID string) (*entity.Subscription, error) {
	return u.repo.GetByUserID(ctx, userID)
}

func (u *SubscriptionUsecase) UpdateSubscription(ctx context.Context, userID, planType string, durationMonths int) (*entity.Subscription, error) {
	existing, err := u.repo.GetByUserID(ctx, userID)

	now := time.Now()
	expiry := now.AddDate(0, durationMonths, 0)

	if err == nil && existing != nil {
		existing.PlanType = planType
		existing.Status = "ACTIVE"
		existing.StartsAt = now
		existing.EndsAt = expiry
		existing.UpdatedAt = now
		err = u.repo.Update(ctx, existing)
		if err != nil {
			return nil, err
		}
		return existing, nil
	}

	sub := &entity.Subscription{
		ID:        uuid.New().String(),
		UserID:    userID,
		PlanType:  planType,
		Status:    "ACTIVE",
		StartsAt:  now,
		EndsAt:    expiry,
		UpdatedAt: now,
	}

	err = u.repo.Create(ctx, sub)
	if err != nil {
		return nil, err
	}

	return sub, nil
}

func (u *SubscriptionUsecase) CancelSubscription(ctx context.Context, id string) (*entity.Subscription, error) {
	existing, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	existing.Status = "CANCELED"
	existing.UpdatedAt = time.Now()
	err = u.repo.Update(ctx, existing)
	return existing, err
}

func (u *SubscriptionUsecase) GetSubscriptionHistory(ctx context.Context, userID string) ([]*entity.Subscription, error) {
	return u.repo.GetByUserIDHistory(ctx, userID)
}

func (u *SubscriptionUsecase) ListSubscriptions(ctx context.Context) ([]*entity.Subscription, error) {
	return u.repo.List(ctx)
}

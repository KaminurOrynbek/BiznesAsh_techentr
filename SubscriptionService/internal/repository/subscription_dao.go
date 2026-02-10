package repository

import (
	"context"
	"fmt"
	"github.com/KaminurOrynbek/BiznesAsh/SubscriptionService/internal/entity"
	"github.com/jmoiron/sqlx"
)

type SubscriptionDAO struct {
	db *sqlx.DB
}

func NewSubscriptionDAO(db *sqlx.DB) *SubscriptionDAO {
	return &SubscriptionDAO{db: db}
}

func (d *SubscriptionDAO) Create(ctx context.Context, sub *entity.Subscription) error {
	query := `
		INSERT INTO subscription_plans (id, user_id, plan_type, status, starts_at, ends_at, updated_at)
		VALUES (:id, :user_id, :plan_type, :status, :starts_at, :ends_at, :updated_at)
	`
	_, err := d.db.NamedExecContext(ctx, query, sub)
	if err != nil {
		return fmt.Errorf("failed to create subscription: %v", err)
	}
	return nil
}

func (d *SubscriptionDAO) GetByUserID(ctx context.Context, userID string) (*entity.Subscription, error) {
	var sub entity.Subscription
	query := `SELECT * FROM subscription_plans WHERE user_id = $1 AND status = 'ACTIVE' LIMIT 1`
	err := d.db.GetContext(ctx, &sub, query, userID)
	if err != nil {
		return nil, err
	}
	return &sub, nil
}

func (d *SubscriptionDAO) GetByID(ctx context.Context, id string) (*entity.Subscription, error) {
	var sub entity.Subscription
	query := `SELECT * FROM subscription_plans WHERE id = $1 LIMIT 1`
	err := d.db.GetContext(ctx, &sub, query, id)
	if err != nil {
		return nil, err
	}
	return &sub, nil
}

func (d *SubscriptionDAO) GetByUserIDHistory(ctx context.Context, userID string) ([]*entity.Subscription, error) {
	var subs []*entity.Subscription
	query := `SELECT * FROM subscription_plans WHERE user_id = $1 ORDER BY starts_at DESC`
	err := d.db.SelectContext(ctx, &subs, query, userID)
	if err != nil {
		return nil, err
	}
	return subs, nil
}

func (d *SubscriptionDAO) Update(ctx context.Context, sub *entity.Subscription) error {
	query := `
		UPDATE subscription_plans
		SET plan_type = :plan_type, status = :status, starts_at = :starts_at, ends_at = :ends_at, updated_at = :updated_at
		WHERE id = :id
	`
	_, err := d.db.NamedExecContext(ctx, query, sub)
	if err != nil {
		return fmt.Errorf("failed to update subscription: %v", err)
	}
	return nil
}

func (d *SubscriptionDAO) List(ctx context.Context) ([]*entity.Subscription, error) {
	var subs []*entity.Subscription
	query := `SELECT * FROM subscription_plans`
	err := d.db.SelectContext(ctx, &subs, query)
	if err != nil {
		return nil, err
	}
	return subs, nil
}

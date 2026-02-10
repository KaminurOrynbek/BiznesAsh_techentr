package repository

import (
	"context"
	"fmt"
	"github.com/KaminurOrynbek/BiznesAsh/PaymentService/internal/entity"
	"github.com/jmoiron/sqlx"
)

type TransactionDAO struct {
	db *sqlx.DB
}

func NewTransactionDAO(db *sqlx.DB) *TransactionDAO {
	return &TransactionDAO{db: db}
}

func (d *TransactionDAO) Create(ctx context.Context, tx *entity.Transaction) error {
	query := `
		INSERT INTO payment_transactions (id, user_id, amount, currency, reference_type, reference_id, status, created_at)
		VALUES (:id, :user_id, :amount, :currency, :reference_type, :reference_id, :status, :created_at)
	`
	_, err := d.db.NamedExecContext(ctx, query, tx)
	if err != nil {
		return fmt.Errorf("failed to create transaction: %v", err)
	}
	return nil
}

func (d *TransactionDAO) GetByUserID(ctx context.Context, userID string) ([]*entity.Transaction, error) {
	var txs []*entity.Transaction
	query := `SELECT * FROM payment_transactions WHERE user_id = $1 ORDER BY created_at DESC`
	err := d.db.SelectContext(ctx, &txs, query, userID)
	if err != nil {
		return nil, err
	}
	return txs, nil
}

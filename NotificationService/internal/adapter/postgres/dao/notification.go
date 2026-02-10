package dao

import (
	"context"
	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/postgres/model"
	"github.com/jmoiron/sqlx"
)

type NotificationDAO struct {
	db *sqlx.DB
}

func NewNotificationDAO(db *sqlx.DB) *NotificationDAO {
	return &NotificationDAO{db: db}
}

func (dao *NotificationDAO) Save(ctx context.Context, notification *model.Notification) error {
	query := `
		INSERT INTO notifications (id, user_id, actor_id, actor_username, message, post_id, comment_id, type, created_at, is_read, metadata)
		VALUES (:id, :user_id, :actor_id, :actor_username, :message, :post_id, :comment_id, :type, :created_at, :is_read, :metadata)
	`
	_, err := dao.db.NamedExecContext(ctx, query, notification)
	return err
}

func (dao *NotificationDAO) UserExists(ctx context.Context, userID string) (bool, error) {
	const query = `SELECT 1 FROM users WHERE id = $1 LIMIT 1`
	var exists int
	err := dao.db.GetContext(ctx, &exists, query, userID)
	if err != nil {
		// Not found is not an error, just return false
		return false, nil
	}
	return true, nil
}

func (dao *NotificationDAO) PostExists(ctx context.Context, postID string) (bool, error) {
	const query = `SELECT 1 FROM posts WHERE id = $1 LIMIT 1`
	var exists int
	err := dao.db.GetContext(ctx, &exists, query, postID)
	if err != nil {
		return false, nil
	}
	return true, nil
}

func (dao *NotificationDAO) GetNotifications(ctx context.Context, userID string, limit, offset int) ([]*model.Notification, int, error) {
	var notifications []*model.Notification
	var total int

	// Get total count
	countQuery := `SELECT COUNT(*) FROM notifications WHERE user_id = $1`
	err := dao.db.GetContext(ctx, &total, countQuery, userID)
	if err != nil {
		return nil, 0, err
	}

	// Get notifications
	query := `
		SELECT 
			id, user_id, 
			COALESCE(actor_id, '') as actor_id, 
			COALESCE(actor_username, '') as actor_username, 
			message, post_id, comment_id, type, created_at, is_read, 
			COALESCE(metadata, '{}') as metadata
		FROM notifications
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`
	err = dao.db.SelectContext(ctx, &notifications, query, userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	return notifications, total, nil
}

func (dao *NotificationDAO) DB() *sqlx.DB {
	return dao.db
}

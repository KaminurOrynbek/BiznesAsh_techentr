package dao

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/postgres/model"
	"github.com/jmoiron/sqlx"
)

type LikeDao struct {
	db *sqlx.DB
}

func NewLikeDao(db *sqlx.DB) *LikeDao {
	return &LikeDao{db: db}
}

func (d *LikeDao) Create(ctx context.Context, like *model.Like) error {
	query := `INSERT INTO likes (id, post_id, comment_id, user_id, created_at) 
			  VALUES (:id, :post_id, :comment_id, :user_id, :created_at)`
	_, err := d.db.NamedExecContext(ctx, query, like)
	return err
}

func (d *LikeDao) Delete(ctx context.Context, postID, commentID, userID string) error {
	var query string
	var args []interface{}

	if postID != "" {
		query = `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`
		args = append(args, postID, userID)
	} else if commentID != "" {
		query = `DELETE FROM likes WHERE comment_id = $1 AND user_id = $2`
		args = append(args, commentID, userID)
	} else {
		return fmt.Errorf("postID or commentID must be provided")
	}

	_, err := d.db.ExecContext(ctx, query, args...)
	return err
}

func (d *LikeDao) Count(ctx context.Context, postID, commentID string) (int32, error) {
	var query string
	var args []interface{}
	var count int

	if postID != "" {
		query = `SELECT COUNT(*) FROM likes WHERE post_id = $1`
		args = append(args, postID)
	} else if commentID != "" {
		query = `SELECT COUNT(*) FROM likes WHERE comment_id = $1`
		args = append(args, commentID)
	} else {
		return 0, fmt.Errorf("postID or commentID must be provided")
	}

	err := d.db.QueryRowContext(ctx, query, args...).Scan(&count)
	if err != nil {
		return 0, err
	}
	return int32(count), nil
}

func (d *LikeDao) Exists(ctx context.Context, postID, commentID, userID string) (bool, error) {
	var query string
	var args []interface{}
	var count int

	if postID != "" {
		query = `SELECT COUNT(*) FROM likes WHERE post_id = $1 AND user_id = $2`
		args = append(args, postID, userID)
	} else if commentID != "" {
		query = `SELECT COUNT(*) FROM likes WHERE comment_id = $1 AND user_id = $2`
		args = append(args, commentID, userID)
	} else {
		return false, fmt.Errorf("postID or commentID must be provided")
	}

	err := d.db.QueryRowContext(ctx, query, args...).Scan(&count)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, err
	}
	return count > 0, nil
}

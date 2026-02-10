package model

import (
	"time"
)

type Like struct {
	ID        string    `db:"id"`
	PostID    *string   `db:"post_id"`
	CommentID *string   `db:"comment_id"`
	UserID    string    `db:"user_id"`
	CreatedAt time.Time `db:"created_at"`
}

func (Like) TableName() string {
	return "likes"
}

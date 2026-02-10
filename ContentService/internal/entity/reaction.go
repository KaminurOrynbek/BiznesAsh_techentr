package entity

import (
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity/enum"
	"time"
)

type Reaction struct {
	ID        string
	PostID    string
	UserID    string
	CommentID string
	Type      enum.ReactionType
	CreatedAt time.Time
}

type ReactionSummary struct {
	Type        enum.ReactionType
	Count       int32
	UserReacted bool
}

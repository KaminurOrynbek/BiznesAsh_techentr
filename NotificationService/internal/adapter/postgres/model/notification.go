package model

import (
	"encoding/json"
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
	"time"
)

type Notification struct {
	ID            string    `db:"id"`
	UserID        string    `db:"user_id"`
	Message       string    `db:"message"`
	ActorID       string    `db:"actor_id"`
	ActorUsername string    `db:"actor_username"`
	PostID        *string   `db:"post_id"`    // Pointer to allow NULL
	CommentID     *string   `db:"comment_id"` // Pointer to allow NULL
	Type          string    `db:"type"`
	CreatedAt     time.Time `db:"created_at"`
	IsRead        bool      `db:"is_read"`
	Metadata      []byte    `db:"metadata"` // JSONB
}

func (Notification) TableName() string {
	return "notifications"
}

func (n *Notification) ToEntity() *entity.Notification {
	var metadata map[string]interface{}
	if len(n.Metadata) > 0 {
		_ = json.Unmarshal(n.Metadata, &metadata)
	}
	return &entity.Notification{
		ID:            n.ID,
		UserID:        n.UserID,
		Message:       n.Message,
		ActorID:       n.ActorID,
		ActorUsername: n.ActorUsername,
		PostID:        n.PostID,
		CommentID:     n.CommentID,
		Type:          n.Type,
		CreatedAt:     n.CreatedAt,
		IsRead:        n.IsRead,
		Metadata:      metadata,
	}
}

func FromEntityNotification(e *entity.Notification) *Notification {
	metadata, _ := json.Marshal(e.Metadata)
	return &Notification{
		ID:            e.ID,
		UserID:        e.UserID,
		Message:       e.Message,
		ActorID:       e.ActorID,
		ActorUsername: e.ActorUsername,
		PostID:        e.PostID,
		CommentID:     e.CommentID,
		Type:          e.Type,
		CreatedAt:     e.CreatedAt,
		IsRead:        e.IsRead,
		Metadata:      metadata,
	}
}

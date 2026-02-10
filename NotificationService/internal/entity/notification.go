package entity

import "time"

type Notification struct {
	ID            string
	UserID        string
	Message       string //content
	ActorID       string
	ActorUsername string
	PostID        *string
	CommentID     *string
	Type          string // Type: WELCOME, COMMENT, REPORT, SYSTEM
	CreatedAt     time.Time
	IsRead        bool //"read/unread" status.
	Metadata      map[string]interface{}
}

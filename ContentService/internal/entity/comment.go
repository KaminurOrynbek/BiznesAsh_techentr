package entity

import "time"

type Comment struct {
	ID         string
	PostID     string
	AuthorID   string
	Content    string
	CreatedAt  time.Time
	UpdatedAt  time.Time
	Liked      bool
	LikesCount int32
}

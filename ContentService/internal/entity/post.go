package entity

import (
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity/enum"
	"time"
)

type Post struct {
	ID            string
	Title         string
	Content       string
	Type          enum.PostType
	AuthorID      string
	CreatedAt     time.Time
	UpdatedAt     time.Time
	Published     bool
	LikesCount    int32
	DislikesCount int32
	CommentsCount int32
	Comments      []*Comment
	Liked         bool
	Images        []string
	Files         []string
	Poll          *Poll
}

type Poll struct {
	ID                string
	Question          string
	Options           []*PollOption
	ExpiresAt         time.Time
	TotalVotes        int32
	UserVotedOptionID string
}

type PollOption struct {
	ID         string
	Text       string
	VotesCount int32
}

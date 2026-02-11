package model

import (
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
	"time"
)

type Poll struct {
	ID        string    `db:"id"`
	PostID    string    `db:"post_id"`
	Question  string    `db:"question"`
	ExpiresAt time.Time `db:"expires_at"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

func (Poll) TableName() string {
	return "polls"
}

type PollOption struct {
	ID         string `db:"id"`
	PollID     string `db:"poll_id"`
	Text       string `db:"text"`
	VotesCount int32  `db:"votes_count"`
}

func (PollOption) TableName() string {
	return "poll_options"
}

type PollVote struct {
	PollID   string `db:"poll_id"`
	OptionID string `db:"option_id"`
	UserID   string `db:"user_id"`
}

func (PollVote) TableName() string {
	return "poll_votes"
}

func (p *Poll) ToEntity(options []*PollOption, totalVotes int32, userVotedOptionID string) *entity.Poll {
	var entityOptions []*entity.PollOption
	for _, o := range options {
		entityOptions = append(entityOptions, o.ToEntity())
	}

	return &entity.Poll{
		ID:                p.ID,
		Question:          p.Question,
		Options:           entityOptions,
		ExpiresAt:         p.ExpiresAt,
		TotalVotes:        totalVotes,
		UserVotedOptionID: userVotedOptionID,
	}
}

func (o *PollOption) ToEntity() *entity.PollOption {
	return &entity.PollOption{
		ID:         o.ID,
		Text:       o.Text,
		VotesCount: o.VotesCount,
	}
}

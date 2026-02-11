package dao

import (
	"context"
	"database/sql"
	"errors"
	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/postgres/model"
	"github.com/jmoiron/sqlx"
)

type PollDAO struct {
	db *sqlx.DB
}

func NewPollDAO(db *sqlx.DB) *PollDAO {
	return &PollDAO{db: db}
}

func (dao *PollDAO) Create(ctx context.Context, poll *model.Poll, options []*model.PollOption) error {
	tx, err := dao.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	pollQuery := `
		INSERT INTO polls (id, post_id, question, expires_at, created_at, updated_at)
		VALUES (:id, :post_id, :question, :expires_at, :created_at, :updated_at)
	`
	if _, err := tx.NamedExecContext(ctx, pollQuery, poll); err != nil {
		return err
	}

	optionQuery := `
		INSERT INTO poll_options (id, poll_id, text, votes_count)
		VALUES (:id, :poll_id, :text, :votes_count)
	`
	for _, opt := range options {
		if _, err := tx.NamedExecContext(ctx, optionQuery, opt); err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (dao *PollDAO) GetByPostID(ctx context.Context, postID string, userID string) (*model.Poll, []*model.PollOption, int32, string, error) {
	var poll model.Poll
	pollQuery := `SELECT id, post_id, question, expires_at, created_at, updated_at FROM polls WHERE post_id = $1`
	if err := dao.db.GetContext(ctx, &poll, pollQuery, postID); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil, 0, "", nil
		}
		return nil, nil, 0, "", err
	}

	var options []*model.PollOption
	optionQuery := `SELECT id, poll_id, text, votes_count FROM poll_options WHERE poll_id = $1`
	if err := dao.db.SelectContext(ctx, &options, optionQuery, poll.ID); err != nil {
		return nil, nil, 0, "", err
	}

	var totalVotes int64
	voteCountQuery := `SELECT COUNT(*) FROM poll_votes WHERE poll_id = $1`
	if err := dao.db.GetContext(ctx, &totalVotes, voteCountQuery, poll.ID); err != nil {
		return nil, nil, 0, "", err
	}

	var userVotedOptionID string
	if userID != "" {
		userVoteQuery := `SELECT option_id FROM poll_votes WHERE poll_id = $1 AND user_id = $2`
		err := dao.db.GetContext(ctx, &userVotedOptionID, userVoteQuery, poll.ID, userID)
		if err != nil && err != sql.ErrNoRows {
			return nil, nil, 0, "", err
		}
	}

	return &poll, options, int32(totalVotes), userVotedOptionID, nil
}

func (dao *PollDAO) Vote(ctx context.Context, pollID, optionID string, userID string) error {
	tx, err := dao.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Check if user already voted
	var existingOptionID string
	checkQuery := `SELECT option_id FROM poll_votes WHERE poll_id = $1 AND user_id = $2`
	err = tx.GetContext(ctx, &existingOptionID, checkQuery, pollID, userID)
	if err == nil {
		if existingOptionID == optionID {
			return nil
		}
		return errors.New("user already voted for a different option")
	} else if err != sql.ErrNoRows {
		return err
	}

	// Insert vote
	voteQuery := `INSERT INTO poll_votes (poll_id, option_id, user_id) VALUES ($1, $2, $3)`
	if _, err := tx.ExecContext(ctx, voteQuery, pollID, optionID, userID); err != nil {
		return err
	}

	// Update option vote count
	updateQuery := `UPDATE poll_options SET votes_count = votes_count + 1 WHERE id = $1`
	if _, err := tx.ExecContext(ctx, updateQuery, optionID); err != nil {
		return err
	}

	return tx.Commit()
}

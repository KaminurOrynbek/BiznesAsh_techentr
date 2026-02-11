package Impl

import (
	"context"
	"errors"
	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/postgres/dao"
	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/postgres/model"
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
	_interface "github.com/KaminurOrynbek/BiznesAsh/internal/repository/interface"
	"github.com/google/uuid"
	"time"
)

type postRepositoryImpl struct {
	dao     *dao.PostDAO
	pollDao *dao.PollDAO
}

func NewPostRepository(dao *dao.PostDAO, pollDao *dao.PollDAO) _interface.PostRepository {
	return &postRepositoryImpl{dao: dao, pollDao: pollDao}
}

func (r *postRepositoryImpl) Create(ctx context.Context, post *entity.Post) error {
	txErr := r.dao.Create(ctx, model.FromEntityPost(post))
	if txErr != nil {
		return txErr
	}

	if post.Poll != nil {
		pollModel := &model.Poll{
			ID:        uuid.NewString(),
			PostID:    post.ID,
			Question:  post.Poll.Question,
			ExpiresAt: post.Poll.ExpiresAt,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		var options []*model.PollOption
		for _, opt := range post.Poll.Options {
			options = append(options, &model.PollOption{
				ID:     uuid.NewString(),
				PollID: pollModel.ID,
				Text:   opt.Text,
			})
		}
		return r.pollDao.Create(ctx, pollModel, options)
	}

	return nil
}

func (r *postRepositoryImpl) Update(ctx context.Context, post *entity.Post) error {
	return r.dao.Update(ctx, model.FromEntityPost(post))
}

func (r *postRepositoryImpl) Delete(ctx context.Context, id string) error {
	return r.dao.Delete(ctx, id)
}

func (r *postRepositoryImpl) GetByID(ctx context.Context, id string, userID string) (*entity.Post, error) {
	modelPost, err := r.dao.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	entPost := modelPost.ToEntity()

	// Preload poll if exists
	poll, options, totalVotes, userVotedOptionID, err := r.pollDao.GetByPostID(ctx, id, userID)
	if err == nil && poll != nil {
		entPost.Poll = poll.ToEntity(options, totalVotes, userVotedOptionID)
	}

	return entPost, nil
}

func (r *postRepositoryImpl) List(ctx context.Context, offset, limit int, userID string) ([]*entity.Post, error) {
	modelPosts, err := r.dao.List(ctx, offset, limit)
	if err != nil {
		return nil, err
	}

	var entityPosts []*entity.Post
	for _, mp := range modelPosts {
		ep := mp.ToEntity()
		// Preload poll if exists
		poll, options, totalVotes, userVotedOptionID, err := r.pollDao.GetByPostID(ctx, ep.ID, userID)
		if err == nil && poll != nil {
			ep.Poll = poll.ToEntity(options, totalVotes, userVotedOptionID)
		}
		entityPosts = append(entityPosts, ep)
	}

	return entityPosts, nil
}

func (r *postRepositoryImpl) Search(ctx context.Context, keyword string, offset, limit int, userID string) ([]*entity.Post, error) {
	modelPosts, err := r.dao.Search(ctx, keyword, offset, limit)
	if err != nil {
		return nil, err
	}

	var entityPosts []*entity.Post
	for _, mp := range modelPosts {
		ep := mp.ToEntity()
		// Preload poll if exists
		poll, options, totalVotes, userVotedOptionID, err := r.pollDao.GetByPostID(ctx, ep.ID, userID)
		if err == nil && poll != nil {
			ep.Poll = poll.ToEntity(options, totalVotes, userVotedOptionID)
		}
		entityPosts = append(entityPosts, ep)
	}

	return entityPosts, nil
}

func (r *postRepositoryImpl) VotePoll(ctx context.Context, postID, optionID, userID string) error {
	poll, _, _, _, err := r.pollDao.GetByPostID(ctx, postID, "")
	if err != nil {
		return err
	}
	if poll == nil {
		return errors.New("poll not found for this post")
	}
	return r.pollDao.Vote(ctx, poll.ID, optionID, userID)
}

package Impl

import (
	"context"
	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/postgres/dao"
	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/postgres/model"
	_interface "github.com/KaminurOrynbek/BiznesAsh/internal/repository/interface"
	"github.com/google/uuid"
	"time"
)

type likeRepositoryImpl struct {
	dao *dao.LikeDao
}

func NewLikeRepository(dao *dao.LikeDao) _interface.LikeRepository {
	return &likeRepositoryImpl{dao: dao}
}

func (r *likeRepositoryImpl) LikePost(ctx context.Context, userID, postID string) error {
	exists, err := r.dao.Exists(ctx, postID, "", userID)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	like := &model.Like{
		ID:        uuid.NewString(),
		PostID:    &postID,
		UserID:    userID,
		CreatedAt: time.Now(),
	}
	return r.dao.Create(ctx, like)
}

func (r *likeRepositoryImpl) UnlikePost(ctx context.Context, userID, postID string) error {
	return r.dao.Delete(ctx, postID, "", userID)
}

func (r *likeRepositoryImpl) GetPostLikes(ctx context.Context, postID string) (int32, error) {
	return r.dao.Count(ctx, postID, "")
}

func (r *likeRepositoryImpl) IsPostLiked(ctx context.Context, userID, postID string) (bool, error) {
	return r.dao.Exists(ctx, postID, "", userID)
}

func (r *likeRepositoryImpl) LikeComment(ctx context.Context, userID, commentID string) error {
	exists, err := r.dao.Exists(ctx, "", commentID, userID)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	like := &model.Like{
		ID:        uuid.NewString(),
		CommentID: &commentID,
		UserID:    userID,
		CreatedAt: time.Now(),
	}
	return r.dao.Create(ctx, like)
}

func (r *likeRepositoryImpl) UnlikeComment(ctx context.Context, userID, commentID string) error {
	return r.dao.Delete(ctx, "", commentID, userID)
}

func (r *likeRepositoryImpl) GetCommentLikes(ctx context.Context, commentID string) (int32, error) {
	return r.dao.Count(ctx, "", commentID)
}

func (r *likeRepositoryImpl) IsCommentLiked(ctx context.Context, userID, commentID string) (bool, error) {
	return r.dao.Exists(ctx, "", commentID, userID)
}

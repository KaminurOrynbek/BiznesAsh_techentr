package _interface

import (
	"context"
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
)

type PostUsecase interface {
	CreatePost(ctx context.Context, post *entity.Post) error
	UpdatePost(ctx context.Context, post *entity.Post) error
	DeletePost(ctx context.Context, id string) error
	GetPost(ctx context.Context, id string, currentUserID string) (*entity.Post, error)
	ListPosts(ctx context.Context, offset, limit int, currentUserID string) ([]*entity.Post, error)
	SearchPosts(ctx context.Context, keyword string, offset, limit int, currentUserID string) ([]*entity.Post, error)
	VotePoll(ctx context.Context, postID, optionID, userID string) error
}

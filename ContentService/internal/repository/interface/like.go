package _interface

import (
	"context"
)

type LikeRepository interface {
	LikePost(ctx context.Context, userID, postID string) error
	UnlikePost(ctx context.Context, userID, postID string) error
	GetPostLikes(ctx context.Context, postID string) (int32, error)
	IsPostLiked(ctx context.Context, userID, postID string) (bool, error)

	LikeComment(ctx context.Context, userID, commentID string) error
	UnlikeComment(ctx context.Context, userID, commentID string) error
	GetCommentLikes(ctx context.Context, commentID string) (int32, error)
	IsCommentLiked(ctx context.Context, userID, commentID string) (bool, error)
}

package impl

import (
	"context"
	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/nats/payloads"
	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/nats/publisher"
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
	_interface "github.com/KaminurOrynbek/BiznesAsh/internal/repository/interface"
	usecase "github.com/KaminurOrynbek/BiznesAsh/internal/usecase/interface"
	"github.com/google/uuid"
	"time"
)

type commentUsecaseImpl struct {
	commentRepo      _interface.CommentRepository
	postRepo         _interface.PostRepository
	likeRepo         _interface.LikeRepository
	contentPublisher *publisher.ContentPublisher
}

func NewCommentUsecase(
	commentRepo _interface.CommentRepository,
	postRepo _interface.PostRepository,
	likeRepo _interface.LikeRepository,
	contentPublisher *publisher.ContentPublisher,
) usecase.CommentUsecase {
	return &commentUsecaseImpl{
		commentRepo:      commentRepo,
		postRepo:         postRepo,
		likeRepo:         likeRepo,
		contentPublisher: contentPublisher,
	}
}

func (u *commentUsecaseImpl) CreateComment(ctx context.Context, comment *entity.Comment) error {
	comment.ID = uuid.NewString()
	comment.CreatedAt = time.Now()
	comment.UpdatedAt = comment.CreatedAt
	err := u.commentRepo.Create(ctx, comment)
	if err != nil {
		return err
	}

	// Find post owner
	post, err := u.postRepo.GetByID(ctx, comment.PostID)
	if err == nil {
		_ = u.contentPublisher.PublishCommentCreated(payloads.CommentCreated{
			CommentID:    comment.ID,
			PostID:       comment.PostID,
			ActorID:      comment.AuthorID,
			TargetUserID: post.AuthorID,
			Content:      comment.Content,
		})
	}

	return nil
}

func (u *commentUsecaseImpl) UpdateComment(ctx context.Context, comment *entity.Comment) error {
	comment.UpdatedAt = time.Now()
	return u.commentRepo.Update(ctx, comment)
}

func (u *commentUsecaseImpl) DeleteComment(ctx context.Context, commentID string) error {
	return u.commentRepo.Delete(ctx, commentID)
}

func (u *commentUsecaseImpl) ListCommentsByPostID(ctx context.Context, postID string, currentUserID string) ([]*entity.Comment, error) {
	comments, err := u.commentRepo.ListByPostID(ctx, postID)
	if err != nil {
		return nil, err
	}

	for _, c := range comments {
		likesCount, _ := u.likeRepo.GetCommentLikes(ctx, c.ID)
		c.LikesCount = likesCount

		if currentUserID != "" {
			liked, _ := u.likeRepo.IsCommentLiked(ctx, currentUserID, c.ID)
			c.Liked = liked
		}
	}

	return comments, nil
}

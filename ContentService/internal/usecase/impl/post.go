package impl

import (
	"context"
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
	_interface "github.com/KaminurOrynbek/BiznesAsh/internal/repository/interface"
	usecase "github.com/KaminurOrynbek/BiznesAsh/internal/usecase/interface"
	"github.com/google/uuid"

	"time"
)

type postUsecaseImpl struct {
	postRepo    _interface.PostRepository
	commentRepo _interface.CommentRepository
	likeRepo    _interface.LikeRepository
}

func NewPostUsecase(postRepo _interface.PostRepository, commentRepo _interface.CommentRepository, likeRepo _interface.LikeRepository) usecase.PostUsecase {
	return &postUsecaseImpl{
		postRepo:    postRepo,
		commentRepo: commentRepo,
		likeRepo:    likeRepo,
	}
}

func (u *postUsecaseImpl) CreatePost(ctx context.Context, post *entity.Post) error {
	post.ID = uuid.NewString()
	post.CreatedAt = time.Now()
	post.UpdatedAt = post.CreatedAt
	return u.postRepo.Create(ctx, post)
}

func (u *postUsecaseImpl) UpdatePost(ctx context.Context, post *entity.Post) error {
	post.UpdatedAt = time.Now()
	return u.postRepo.Update(ctx, post)
}

func (u *postUsecaseImpl) DeletePost(ctx context.Context, id string) error {
	return u.postRepo.Delete(ctx, id)
}

func (u *postUsecaseImpl) GetPost(ctx context.Context, id string, currentUserID string) (*entity.Post, error) {
	post, err := u.postRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	comments, err := u.commentRepo.ListByPostID(ctx, id)
	if err != nil {
		return nil, err
	}
	post.Comments = comments
	post.CommentsCount = int32(len(comments))

	likesCount, _ := u.likeRepo.GetPostLikes(ctx, id)
	post.LikesCount = likesCount

	if currentUserID != "" {
		liked, _ := u.likeRepo.IsPostLiked(ctx, currentUserID, id)
		post.Liked = liked
	}

	return post, nil
}

func (u *postUsecaseImpl) ListPosts(ctx context.Context, offset, limit int, currentUserID string) ([]*entity.Post, error) {
	posts, err := u.postRepo.List(ctx, offset, limit)
	if err != nil {
		return nil, err
	}

	for _, post := range posts {
		comments, err := u.commentRepo.ListByPostID(ctx, post.ID)
		if err == nil {
			post.Comments = comments
			post.CommentsCount = int32(len(comments))
		}

		likesCount, _ := u.likeRepo.GetPostLikes(ctx, post.ID)
		post.LikesCount = likesCount

		if currentUserID != "" {
			liked, _ := u.likeRepo.IsPostLiked(ctx, currentUserID, post.ID)
			post.Liked = liked
		}
	}

	return posts, nil
}

func (u *postUsecaseImpl) SearchPosts(ctx context.Context, keyword string, offset, limit int, currentUserID string) ([]*entity.Post, error) {
	posts, err := u.postRepo.Search(ctx, keyword, offset, limit)
	if err != nil {
		return nil, err
	}

	for _, post := range posts {
		comments, err := u.commentRepo.ListByPostID(ctx, post.ID)
		if err == nil {
			post.CommentsCount = int32(len(comments))
		}

		likesCount, _ := u.likeRepo.GetPostLikes(ctx, post.ID)
		post.LikesCount = likesCount

		if currentUserID != "" {
			liked, _ := u.likeRepo.IsPostLiked(ctx, currentUserID, post.ID)
			post.Liked = liked
		}
	}

	return posts, nil
}

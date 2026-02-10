package impl

import (
	"context"
	"fmt"
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
	_interface "github.com/KaminurOrynbek/BiznesAsh/internal/repository/interface"
	usecase "github.com/KaminurOrynbek/BiznesAsh/internal/usecase/interface"
	userpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/user"
	"github.com/google/uuid"
	"log"
	"time"
)

type notificationUsecase struct {
	repo       _interface.NotificationRepository
	userClient userpb.UserServiceClient
}

func NewNotificationUsecase(repo _interface.NotificationRepository, userClient userpb.UserServiceClient, sender usecase.EmailSender) *notificationUsecase {
	return &notificationUsecase{
		repo:       repo,
		userClient: userClient,
	}
}

func (u *notificationUsecase) SendCommentNotification(ctx context.Context, n *entity.Notification) error {
	return u.saveTypedNotification(ctx, n, "COMMENT")
}

func (u *notificationUsecase) SendReportNotification(ctx context.Context, n *entity.Notification) error {
	return u.saveTypedNotification(ctx, n, "REPORT")
}

func (u *notificationUsecase) NotifyNewPost(ctx context.Context, n *entity.Notification) error {
	return u.saveTypedNotification(ctx, n, "NEW_POST")
}

func (u *notificationUsecase) NotifyPostUpdate(ctx context.Context, n *entity.Notification) error {
	return u.saveTypedNotification(ctx, n, "POST_UPDATE")
}

func (u *notificationUsecase) NotifySystemMessage(ctx context.Context, n *entity.Notification) error {
	return u.saveTypedNotification(ctx, n, "SYSTEM")
}

func (u *notificationUsecase) NotifyPostLike(ctx context.Context, n *entity.Notification) error {
	return u.saveTypedNotification(ctx, n, "POST_LIKE")
}

func (u *notificationUsecase) NotifyCommentLike(ctx context.Context, n *entity.Notification) error {
	return u.saveTypedNotification(ctx, n, "COMMENT_LIKE")
}

func (u *notificationUsecase) GetNotifications(ctx context.Context, userID string, page, limit int) ([]*entity.Notification, int, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit
	return u.repo.GetNotifications(ctx, userID, limit, offset)
}

func (u *notificationUsecase) saveTypedNotification(ctx context.Context, n *entity.Notification, typ string) error {
	// Allow self-notifications for now (as requested by user)
	if n.ActorID != "" && n.ActorID == n.UserID {
		log.Printf("[INFO] Processing self-notification for user %s", n.UserID)
	}

	// 1. Fetch actor username if missing
	if n.ActorID != "" && n.ActorUsername == "" {
		log.Printf("[DEBUG] Fetching username for actor %s", n.ActorID)
		resp, err := u.userClient.GetUser(ctx, &userpb.GetUserRequest{UserId: n.ActorID})
		if err == nil && resp != nil {
			n.ActorUsername = resp.Username
			log.Printf("[DEBUG] Found actor username: %s", n.ActorUsername)
		} else {
			log.Printf("[DEBUG] Failed to fetch actor username: %v", err)
		}
	}

	// Validate user exists
	exists, err := u.repo.UserExists(ctx, n.UserID)
	if err != nil {
		return fmt.Errorf("failed to verify user: %w", err)
	}
	if !exists {
		return fmt.Errorf("user with ID %s does not exist", n.UserID)
	}

	//Validate post exists
	if n.PostID != nil && *n.PostID != "" {
		exists, err := u.repo.PostExists(ctx, *n.PostID)
		if err != nil {
			return fmt.Errorf("failed to verify post: %w", err)
		}
		if !exists {
			return fmt.Errorf("post with ID %s does not exist", n.PostID)
		}
	}

	if n.ID == "" {
		n.ID = uuid.NewString()
	}
	if n.CreatedAt.IsZero() {
		n.CreatedAt = time.Now()
	}
	n.Type = typ
	n.IsRead = false
	return u.repo.SaveNotification(ctx, n)
}

func (u *notificationUsecase) GetWelcomeEmailHTML() string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to BiznesAsh</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #b3c8e8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: white; padding: 40px; border-radius: 16px;">
    <h2 style="color: #333333; text-align: left;">Welcome to <span style="color: #003087;">BiznesAsh</span>!</h2>
    <p style="font-size: 16px; color: #333; line-height: 1.5;">Dear Future Entrepreneur,</p>
    <p style="font-size: 16px; color: #333; line-height: 1.5;">
      We are delighted to welcome you to BiznesAsh. Our platform is designed to foster connections, collaboration, and growth among entrepreneurs. We are committed to providing the resources and support you need to thrive in your entrepreneurial journey.
    </p>
    <p style="font-size: 16px; color: #333; line-height: 1.5;">
      We look forward to seeing you leverage the opportunities available within our community.
    </p>
    <p style="font-size: 16px; color: #333; line-height: 1.5;">Sincerely,<br>The BiznesAsh Team</p>
    <div style="display: flex; align-items: center; margin-top: 30px;">
      <img src="data:image/jpeg;base64,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" alt="BiznesAsh Logo" style="width: 80px; height: 80px; margin-right: 20px; border-radius: 8px;">
      <div>
        <p style="font-size: 16px; color: #003087; margin: 0; font-weight: bold;">BiznesAsh</p>
        <p style="font-size: 14px; color: #003087; margin: 5px 0;">biznesash@info.com</p>
        <a href="https://www.biznesash.com" style="font-size: 14px; color: #003087; text-decoration: underline;">www.biznesash.com</a>
      </div>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <a href="https://www.biznesash.com" style="display: inline-block; background-color: #003087; color: white; padding: 12px 24px; text-decoration: none; border-radius: 24px; font-size: 16px; text-transform: uppercase;">Visit BiznesAsh</a>
    </div>
    <p style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">If you have any questions, just reply to this email. We're here to help you succeed!</p>
  </div>
</body>
</html>`
}

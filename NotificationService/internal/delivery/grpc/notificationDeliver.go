package grpc

import (
	"context"

	"encoding/json"
	"github.com/KaminurOrynbek/BiznesAsh/internal/entity"
	_interface "github.com/KaminurOrynbek/BiznesAsh/internal/usecase/interface"
	notificationpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/notification"
	"log"
	"time"
)

type NotificationDelivery struct {
	notificationpb.UnimplementedNotificationServiceServer
	usecase _interface.CombinedUsecase
}

func NewNotificationDelivery(u _interface.CombinedUsecase) *NotificationDelivery {
	return &NotificationDelivery{
		usecase: u,
	}
}

func (d *NotificationDelivery) SendWelcomeEmail(ctx context.Context, req *notificationpb.EmailRequest) (*notificationpb.NotificationResponse, error) {
	email := &entity.Email{
		To:      req.GetEmail(),
		Subject: req.GetSubject(),
		Body:    req.GetBody(),
	}
	err := d.usecase.SendEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Welcome Email Sent"}, nil
}

func (d *NotificationDelivery) SendCommentNotification(ctx context.Context, req *notificationpb.CommentNotification) (*notificationpb.NotificationResponse, error) {
	notification := &entity.Notification{
		UserID:    req.GetUserId(),
		PostID:    ptr(req.GetPostId()),
		CommentID: ptr(req.GetCommentText()),
		Message:   req.GetCommentText(),
		Type:      "COMMENT",
	}
	err := d.usecase.SendCommentNotification(ctx, notification)
	if err != nil {
		return nil, err
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Comment Notification Sent"}, nil
}

func (d *NotificationDelivery) SendReportNotification(ctx context.Context, req *notificationpb.ReportNotification) (*notificationpb.NotificationResponse, error) {
	notification := &entity.Notification{
		UserID:  req.GetUserId(),
		PostID:  ptr(req.GetPostId()),
		Message: req.GetReason(),
		Type:    "REPORT",
	}
	err := d.usecase.SendReportNotification(ctx, notification)
	if err != nil {
		return nil, err
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Report Notification Sent"}, nil
}

func (d *NotificationDelivery) NotifyNewPost(ctx context.Context, req *notificationpb.NewPostNotification) (*notificationpb.NotificationResponse, error) {
	notification := &entity.Notification{
		UserID:  req.GetUserId(),
		Message: req.GetPostTitle(),
		Type:    "NEW_POST",
	}
	err := d.usecase.NotifyNewPost(ctx, notification)
	if err != nil {
		return nil, err
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "New Post Notification Sent"}, nil
}

func (d *NotificationDelivery) NotifyPostUpdate(ctx context.Context, req *notificationpb.PostUpdateNotification) (*notificationpb.NotificationResponse, error) {
	notification := &entity.Notification{
		UserID:  req.GetUserId(),
		PostID:  ptr(req.GetPostId()),
		Message: req.GetUpdateSummary(),
		Type:    "POST_UPDATE",
	}
	err := d.usecase.NotifyPostUpdate(ctx, notification)
	if err != nil {
		return nil, err
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Post Update Notification Sent"}, nil
}

func (d *NotificationDelivery) NotifySystemMessage(ctx context.Context, req *notificationpb.SystemMessageRequest) (*notificationpb.NotificationResponse, error) {
	notification := &entity.Notification{
		UserID:  req.GetUserId(),
		Message: req.GetMessage(),
		Type:    "SYSTEM",
	}
	err := d.usecase.NotifySystemMessage(ctx, notification)
	if err != nil {
		return nil, err
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "System Message Sent"}, nil
}

func (d *NotificationDelivery) SendVerificationEmail(ctx context.Context, req *notificationpb.EmailRequest) (*notificationpb.NotificationResponse, error) {
	email := &entity.Email{
		To:      req.GetEmail(),
		Subject: req.GetSubject(),
		Body:    req.GetBody(),
	}
	err := d.usecase.SendVerificationEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Verification Email Sent"}, nil
}

func (d *NotificationDelivery) SubscribeToUpdates(ctx context.Context, req *notificationpb.UserID) (*notificationpb.NotificationResponse, error) {
	err := d.usecase.Subscribe(ctx, req.GetUserId(), []string{})
	if err != nil {
		return nil, err
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Subscribed to updates"}, nil
}

func (d *NotificationDelivery) UnsubscribeFromUpdates(ctx context.Context, req *notificationpb.UserID) (*notificationpb.NotificationResponse, error) {
	err := d.usecase.Unsubscribe(ctx, req.GetUserId(), "")
	if err != nil {
		return nil, err
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Unsubscribed from updates"}, nil
}

func (d *NotificationDelivery) GetSubscriptions(ctx context.Context, req *notificationpb.UserID) (*notificationpb.SubscriptionsResponse, error) {
	subs, err := d.usecase.GetSubscriptions(ctx, req.GetUserId())
	if err != nil {
		return nil, err
	}
	return &notificationpb.SubscriptionsResponse{Subscriptions: subs}, nil
}

// small helper function
func ptr(s string) *string {
	return &s
}

func (s *NotificationDelivery) NotifyPostLike(ctx context.Context, req *notificationpb.PostLikeNotification) (*notificationpb.NotificationResponse, error) {
	err := s.usecase.NotifyPostLike(ctx, &entity.Notification{
		UserID:  req.UserId,
		PostID:  ptr(req.PostId),
		Message: "Your post got a new like!",
	})
	if err != nil {
		return &notificationpb.NotificationResponse{Success: false, Message: err.Error()}, nil
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Like notification sent"}, nil
}

func (s *NotificationDelivery) NotifyCommentLike(ctx context.Context, req *notificationpb.CommentLikeNotification) (*notificationpb.NotificationResponse, error) {
	err := s.usecase.NotifyCommentLike(ctx, &entity.Notification{
		UserID:    req.UserId,
		CommentID: ptr(req.CommentId),
		Message:   "Your comment got a new like!",
	})
	if err != nil {
		return &notificationpb.NotificationResponse{Success: false, Message: err.Error()}, nil
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Comment like notification sent"}, nil
}

func (s *NotificationDelivery) GetNotifications(ctx context.Context, req *notificationpb.GetNotificationsRequest) (*notificationpb.GetNotificationsResponse, error) {
	notifications, total, err := s.usecase.GetNotifications(ctx, req.GetUserId(), int(req.GetPage()), int(req.GetLimit()))
	if err != nil {
		log.Printf("[ERROR] NotificationDelivery.GetNotifications: %v", err)
		return nil, err
	}

	pbNotifications := make([]*notificationpb.Notification, len(notifications))
	for i, n := range notifications {
		pbNotifications[i] = &notificationpb.Notification{
			Id:        n.ID,
			UserId:    n.UserID,
			Type:      n.Type,
			Message:   n.Message,
			IsRead:    n.IsRead,
			CreatedAt: n.CreatedAt.Format(time.RFC3339),
			PostId:    deref(n.PostID),
			CommentId: deref(n.CommentID),
			Data:      mapNotificationData(n),
		}
	}

	totalPages := int32(0)
	if req.GetLimit() > 0 {
		totalPages = int32((total + int(req.GetLimit()) - 1) / int(req.GetLimit()))
	}

	return &notificationpb.GetNotificationsResponse{
		Notifications: pbNotifications,
		Total:         int32(total),
		Page:          req.GetPage(),
		TotalPages:    totalPages,
	}, nil
}

func (s *NotificationDelivery) VerifyCode(ctx context.Context, req *notificationpb.VerifyCodeRequest) (*notificationpb.NotificationResponse, error) {
	err := s.usecase.VerifyCode(ctx, req.GetEmail(), req.GetCode())
	if err != nil {
		return &notificationpb.NotificationResponse{Success: false, Message: err.Error()}, nil
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Email verified successfully"}, nil
}

func (s *NotificationDelivery) ResendCode(ctx context.Context, req *notificationpb.ResendCodeRequest) (*notificationpb.NotificationResponse, error) {
	err := s.usecase.ResendCode(ctx, req.GetEmail())
	if err != nil {
		return &notificationpb.NotificationResponse{Success: false, Message: err.Error()}, nil
	}
	return &notificationpb.NotificationResponse{Success: true, Message: "Verification code resent"}, nil
}

func deref(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func mapNotificationData(n *entity.Notification) map[string]string {
	data := make(map[string]string)
	data["actor_id"] = n.ActorID
	data["actor_username"] = n.ActorUsername

	if n.Metadata != nil {
		if b, err := json.Marshal(n.Metadata); err == nil {
			data["metadata"] = string(b)
		}
	}

	// Legacy fields if needed
	if n.PostID != nil {
		data["post_id"] = *n.PostID
	}
	if n.CommentID != nil {
		data["comment_id"] = *n.CommentID
	}

	return data
}

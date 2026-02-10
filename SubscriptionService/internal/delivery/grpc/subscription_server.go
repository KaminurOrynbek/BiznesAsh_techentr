package grpc

import (
	"context"

	"github.com/KaminurOrynbek/BiznesAsh/SubscriptionService/internal/entity"
	"github.com/KaminurOrynbek/BiznesAsh/SubscriptionService/internal/usecase"
	pb "github.com/KaminurOrynbek/BiznesAsh/SubscriptionService/proto"
)

type SubscriptionServer struct {
	pb.UnimplementedSubscriptionServiceServer
	usecase *usecase.SubscriptionUsecase
}

func NewSubscriptionServer(u *usecase.SubscriptionUsecase) *SubscriptionServer {
	return &SubscriptionServer{usecase: u}
}

func (s *SubscriptionServer) GetSubscription(ctx context.Context, req *pb.GetSubscriptionRequest) (*pb.SubscriptionResponse, error) {
	sub, err := s.usecase.GetSubscription(ctx, req.GetUserId())
	if err != nil {
		return nil, err
	}
	return toProto(sub), nil
}

func (s *SubscriptionServer) UpdateSubscription(ctx context.Context, req *pb.UpdateSubscriptionRequest) (*pb.SubscriptionResponse, error) {
	sub, err := s.usecase.UpdateSubscription(ctx, req.GetUserId(), req.GetPlanType(), int(req.GetDurationMonths()))
	if err != nil {
		return nil, err
	}
	return toProto(sub), nil
}

func (s *SubscriptionServer) ListSubscriptions(ctx context.Context, req *pb.Empty) (*pb.ListSubscriptionsResponse, error) {
	subs, err := s.usecase.ListSubscriptions(ctx)
	if err != nil {
		return nil, err
	}

	var resp pb.ListSubscriptionsResponse
	for _, sub := range subs {
		resp.Subscriptions = append(resp.Subscriptions, toProto(sub))
	}
	return &resp, nil
}

func (s *SubscriptionServer) CancelSubscription(ctx context.Context, req *pb.CancelSubscriptionRequest) (*pb.SubscriptionResponse, error) {
	sub, err := s.usecase.CancelSubscription(ctx, req.GetId())
	if err != nil {
		return nil, err
	}
	return toProto(sub), nil
}

func (s *SubscriptionServer) GetSubscriptionHistory(ctx context.Context, req *pb.GetSubscriptionRequest) (*pb.ListSubscriptionsResponse, error) {
	subs, err := s.usecase.GetSubscriptionHistory(ctx, req.GetUserId())
	if err != nil {
		return nil, err
	}

	var resp pb.ListSubscriptionsResponse
	for _, sub := range subs {
		resp.Subscriptions = append(resp.Subscriptions, toProto(sub))
	}
	return &resp, nil
}

func toProto(sub *entity.Subscription) *pb.SubscriptionResponse {
	return &pb.SubscriptionResponse{
		Id:       sub.ID,
		UserId:   sub.UserID,
		PlanType: sub.PlanType,
		Status:   sub.Status,
		StartsAt: sub.StartsAt.Format("2006-01-02T15:04:05Z"),
		EndsAt:   sub.EndsAt.Format("2006-01-02T15:04:05Z"),
	}
}

package grpc

import (
	"context"
	"time"

	"github.com/KaminurOrynbek/BiznesAsh/ConsultationService/internal/usecase"
	pb "github.com/KaminurOrynbek/BiznesAsh/ConsultationService/proto"
)

type ConsultationServer struct {
	pb.UnimplementedConsultationServiceServer
	usecase *usecase.ConsultationUsecase
}

func NewConsultationServer(u *usecase.ConsultationUsecase) *ConsultationServer {
	return &ConsultationServer{usecase: u}
}

func (s *ConsultationServer) RegisterExpert(ctx context.Context, req *pb.ExpertData) (*pb.ExpertProfile, error) {
	expert, err := s.usecase.RegisterExpert(ctx, req.GetUserId(), req.GetSpecialization(), req.GetPricePerSession())
	if err != nil {
		return nil, err
	}
	return &pb.ExpertProfile{
		Id:              expert.ID,
		UserId:          expert.UserID,
		Specialization:  expert.Specialization,
		PricePerSession: expert.PricePerSession,
		IsAvailable:     expert.IsAvailable,
	}, nil
}

func (s *ConsultationServer) ListAvailableExperts(ctx context.Context, req *pb.Filter) (*pb.ExpertList, error) {
	experts, err := s.usecase.ListExperts(ctx)
	if err != nil {
		return nil, err
	}

	var resp pb.ExpertList
	for _, e := range experts {
		resp.Experts = append(resp.Experts, &pb.ExpertProfile{
			Id:              e.ID,
			UserId:          e.UserID,
			Specialization:  e.Specialization,
			PricePerSession: e.PricePerSession,
			IsAvailable:     e.IsAvailable,
		})
	}
	return &resp, nil
}

func (s *ConsultationServer) CreateBooking(ctx context.Context, req *pb.BookingData) (*pb.BookingResponse, error) {
	scheduledAt, err := time.Parse(time.RFC3339, req.GetScheduledAt())
	if err != nil {
		return nil, err
	}

	booking, err := s.usecase.CreateBooking(ctx, req.GetUserId(), req.GetExpertId(), req.GetExpertName(), scheduledAt)
	if err != nil {
		return nil, err
	}

	return &pb.BookingResponse{
		Id:          booking.ID,
		Status:      booking.Status,
		MeetingLink: booking.MeetingLink,
	}, nil
}

func (s *ConsultationServer) ConfirmBookingPayment(ctx context.Context, req *pb.ConfirmPaymentRequest) (*pb.Empty, error) {
	err := s.usecase.ConfirmPayment(ctx, req.GetBookingId())
	if err != nil {
		return nil, err
	}
	return &pb.Empty{}, nil
}

func (s *ConsultationServer) CancelBooking(ctx context.Context, req *pb.CancelBookingRequest) (*pb.BookingResponse, error) {
	booking, err := s.usecase.CancelBooking(ctx, req.GetBookingId())
	if err != nil {
		return nil, err
	}
	return &pb.BookingResponse{
		Id:          booking.ID,
		Status:      booking.Status,
		MeetingLink: booking.MeetingLink,
	}, nil
}

func (s *ConsultationServer) GetUserBookings(ctx context.Context, req *pb.GetUserBookingsRequest) (*pb.BookingList, error) {
	bookings, err := s.usecase.GetUserBookings(ctx, req.GetUserId())
	if err != nil {
		return nil, err
	}

	var resp pb.BookingList
	for _, b := range bookings {
		expertName := ""
		if b.ExpertName.Valid {
			expertName = b.ExpertName.String
		}
		resp.Bookings = append(resp.Bookings, &pb.BookingDetail{
			Id:          b.ID,
			UserId:      b.UserID,
			ExpertId:    b.ExpertID,
			Status:      b.Status,
			ScheduledAt: b.ScheduledAt.Format(time.RFC3339),
			MeetingLink: b.MeetingLink,
			CreatedAt:   b.CreatedAt.Format(time.RFC3339),
			ExpertName:  expertName,
		})
	}
	return &resp, nil
}

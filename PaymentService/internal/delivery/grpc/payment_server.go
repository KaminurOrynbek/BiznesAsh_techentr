package grpc

import (
	"context"

	"github.com/KaminurOrynbek/BiznesAsh/PaymentService/internal/usecase"
	pb "github.com/KaminurOrynbek/BiznesAsh/PaymentService/proto"
)

type PaymentServer struct {
	pb.UnimplementedPaymentServiceServer
	usecase *usecase.PaymentUsecase
}

func NewPaymentServer(u *usecase.PaymentUsecase) *PaymentServer {
	return &PaymentServer{usecase: u}
}

func (s *PaymentServer) ProcessPayment(ctx context.Context, req *pb.ProcessPaymentRequest) (*pb.PaymentResponse, error) {
	tx, err := s.usecase.ProcessPayment(ctx, req.GetUserId(), req.GetAmount(), req.GetCurrency(), req.GetReferenceType(), req.GetReferenceId())
	if err != nil {
		return nil, err
	}
	return &pb.PaymentResponse{
		Id:        tx.ID,
		Status:    tx.Status,
		CreatedAt: tx.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}, nil
}

func (s *PaymentServer) GetTransactionHistory(ctx context.Context, req *pb.GetHistoryRequest) (*pb.HistoryResponse, error) {
	txs, err := s.usecase.GetHistory(ctx, req.GetUserId())
	if err != nil {
		return nil, err
	}

	var resp pb.HistoryResponse
	for _, tx := range txs {
		resp.Transactions = append(resp.Transactions, &pb.PaymentResponse{
			Id:        tx.ID,
			Status:    tx.Status,
			CreatedAt: tx.CreatedAt.Format("2006-01-02T15:04:05Z"),
		})
	}
	return &resp, nil
}

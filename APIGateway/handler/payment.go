package handler

import (
	"context"
	"net/http"

	pb "github.com/KaminurOrynbek/BiznesAsh/PaymentService/proto"
	"github.com/gin-gonic/gin"
)

func RegisterPaymentRoutes(r *gin.Engine, client pb.PaymentServiceClient) {
	api := r.Group("/api/v1/payments")

	api.POST("/process", func(c *gin.Context) {
		var req struct {
			UserID        string  `json:"userId"`
			Amount        float64 `json:"amount"`
			Currency      string  `json:"currency"`
			ReferenceType string  `json:"referenceType"` // SUBSCRIPTION, CONSULTATION
			ReferenceID   string  `json:"referenceId"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resp, err := client.ProcessPayment(context.Background(), &pb.ProcessPaymentRequest{
			UserId:        req.UserID,
			Amount:        req.Amount,
			Currency:      req.Currency,
			ReferenceType: req.ReferenceType,
			ReferenceId:   req.ReferenceID,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})

	api.GET("/history/:userId", func(c *gin.Context) {
		userId := c.Param("userId")
		resp, err := client.GetTransactionHistory(context.Background(), &pb.GetHistoryRequest{UserId: userId})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})
}

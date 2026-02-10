package handler

import (
	"context"
	"net/http"

	pb "github.com/KaminurOrynbek/BiznesAsh/ConsultationService/proto"
	"github.com/gin-gonic/gin"
)

func RegisterConsultationRoutes(r *gin.Engine, client pb.ConsultationServiceClient) {
	api := r.Group("/api/v1/consultations")

	api.GET("/experts", func(c *gin.Context) {
		resp, err := client.ListAvailableExperts(context.Background(), &pb.Filter{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})

	api.POST("/book", func(c *gin.Context) {
		var req struct {
			UserID      string `json:"userId"`
			ExpertID    string `json:"expertId"`
			ExpertName  string `json:"expertName"`
			ScheduledAt string `json:"scheduledAt"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resp, err := client.CreateBooking(context.Background(), &pb.BookingData{
			UserId:      req.UserID,
			ExpertId:    req.ExpertID,
			ExpertName:  req.ExpertName,
			ScheduledAt: req.ScheduledAt,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})

	api.POST("/confirm/:bookingId", func(c *gin.Context) {
		bookingId := c.Param("bookingId")
		_, err := client.ConfirmBookingPayment(context.Background(), &pb.ConfirmPaymentRequest{BookingId: bookingId})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "confirmed"})
	})

	api.GET("/user/:userId", func(c *gin.Context) {
		userId := c.Param("userId")
		resp, err := client.GetUserBookings(context.Background(), &pb.GetUserBookingsRequest{UserId: userId})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp.Bookings)
	})

	api.POST("/cancel", func(c *gin.Context) {
		var req struct {
			BookingID string `json:"bookingId"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resp, err := client.CancelBooking(context.Background(), &pb.CancelBookingRequest{BookingId: req.BookingID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})
}

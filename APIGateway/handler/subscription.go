package handler

import (
	"context"
	"net/http"

	pb "github.com/KaminurOrynbek/BiznesAsh/SubscriptionService/proto"
	"github.com/gin-gonic/gin"
)

func RegisterSubscriptionRoutes(r *gin.Engine, client pb.SubscriptionServiceClient) {
	subs := r.Group("/api/v1/subscriptions")

	subs.GET("/:userId", func(c *gin.Context) {
		userId := c.Param("userId")
		resp, err := client.GetSubscription(context.Background(), &pb.GetSubscriptionRequest{UserId: userId})
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "subscription not found"})
			return
		}
		c.JSON(http.StatusOK, resp)
	})

	subs.POST("/subscribe", func(c *gin.Context) {
		var req struct {
			UserID         string `json:"userId"`
			PlanType       string `json:"planType"`
			DurationMonths int    `json:"durationMonths"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resp, err := client.UpdateSubscription(context.Background(), &pb.UpdateSubscriptionRequest{
			UserId:         req.UserID,
			PlanType:       req.PlanType,
			DurationMonths: int32(req.DurationMonths),
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})

	subs.GET("/history/:userId", func(c *gin.Context) {
		userId := c.Param("userId")
		resp, err := client.GetSubscriptionHistory(context.Background(), &pb.GetSubscriptionRequest{UserId: userId})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp.Subscriptions)
	})

	subs.POST("/cancel", func(c *gin.Context) {
		var req struct {
			ID string `json:"id"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resp, err := client.CancelSubscription(context.Background(), &pb.CancelSubscriptionRequest{Id: req.ID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})
}

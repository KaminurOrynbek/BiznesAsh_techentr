package handler

import (
	"context"
	"encoding/json"
	"net/http"

	notificationpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/notification"
	"github.com/gin-gonic/gin"
)

func RegisterNotificationRoutes(r *gin.Engine, client notificationpb.NotificationServiceClient) {
	// existing routes
	notify := r.Group("/notify")

	notify.POST("/welcome", func(c *gin.Context) {
		var req notificationpb.EmailRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		resp, err := client.SendWelcomeEmail(context.Background(), &req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})

	notify.POST("/system-message", func(c *gin.Context) {
		var req notificationpb.SystemMessageRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		resp, err := client.NotifySystemMessage(context.Background(), &req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})

	notify.POST("/contact", func(c *gin.Context) {
		var req struct {
			Name    string `json:"name"`
			Email   string `json:"email"`
			Subject string `json:"subject"`
			Message string `json:"message"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		payload, _ := json.Marshal(map[string]interface{}{
			"type":    "CONTACT_REQUEST",
			"name":    req.Name,
			"email":   req.Email,
			"subject": req.Subject,
			"content": req.Message,
		})

		resp, err := client.NotifySystemMessage(context.Background(), &notificationpb.SystemMessageRequest{
			Message: string(payload),
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})

	// auth-like routes but in notification svc
	auth := r.Group("/auth")
	auth.POST("/verify-email", func(c *gin.Context) {
		var req notificationpb.VerifyCodeRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		resp, err := client.VerifyCode(context.Background(), &req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if !resp.Success {
			c.JSON(http.StatusBadRequest, resp)
			return
		}
		c.JSON(http.StatusOK, resp)
	})

	auth.POST("/resend-code", func(c *gin.Context) {
		var req notificationpb.ResendCodeRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		resp, err := client.ResendCode(context.Background(), &req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})

	// TEMP: make frontend /notifications stop failing (no 404)
	n := r.Group("/notifications")
	n.GET("", func(c *gin.Context) {
		userID := c.Query("userId")
		if userID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "userId is required"})
			return
		}

		resp, err := client.GetNotifications(context.Background(), &notificationpb.GetNotificationsRequest{
			UserId: userID,
			Page:   1,
			Limit:  20,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp.GetNotifications())
	})
}

package handler

import (
	"context"
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

	// TEMP: make frontend /notifications stop failing (no 404)
	n := r.Group("/notifications")
	n.GET("", func(c *gin.Context) {
		// unreadOnly := c.Query("unreadOnly") // you can read it, but you can't use it yet
		c.JSON(http.StatusOK, []any{})
	})
}

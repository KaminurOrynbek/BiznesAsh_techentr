package handler

import (
	"context"
	"net/http"

	userpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/user"
	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(r *gin.Engine, client userpb.UserServiceClient) {
	auth := r.Group("/auth")

	auth.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true, "src": "TECHENTR_HANDLER"})
	})
	

	auth.POST("/register", func(c *gin.Context) {
		var req userpb.RegisterRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resp, err := client.Register(context.Background(), &req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, resp)
	})

	// POST /auth/login
	auth.POST("/login", func(c *gin.Context) {
		var req userpb.LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resp, err := client.Login(context.Background(), &req)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, resp)
	})
}

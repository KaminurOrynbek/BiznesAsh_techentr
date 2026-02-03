package handler

import (
	"context"
	"net/http"
	"strings"

	userpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/user"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/metadata"
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

		// Return token and user so frontend does not need a separate GET /auth/me
		authHeader := "Bearer " + resp.GetToken()
		ctx := metadata.NewOutgoingContext(context.Background(), metadata.Pairs("authorization", authHeader))
		userResp, err := client.GetCurrentUser(ctx, &userpb.Empty{})
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"userId": resp.GetUserId(), "token": resp.GetToken()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"token": resp.GetToken(),
			"user": gin.H{
				"id":        userResp.GetUserId(),
				"username":  userResp.GetUsername(),
				"email":     userResp.GetEmail(),
				"role":      userResp.GetRole(),
				"bio":       userResp.GetBio(),
				"createdAt": "",
				"updatedAt": "",
			},
		})
	})

	// GET /auth/me - current user (requires Bearer token)
	auth.GET("/me", func(c *gin.Context) {
		handleGetCurrentUser(c, client)
	})

	// GET /users/me - current user (requires Bearer token), same as /auth/me
	users := r.Group("/users")
	users.GET("/me", func(c *gin.Context) {
		handleGetCurrentUser(c, client)
	})
	users.PUT("/:id", updateProfileHandler(client))
}

// handleGetCurrentUser forwards Authorization header to UserService and returns current user.
func handleGetCurrentUser(c *gin.Context, client userpb.UserServiceClient) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid authorization header"})
		return
	}

	ctx := metadata.NewOutgoingContext(c.Request.Context(), metadata.Pairs("authorization", authHeader))
	resp, err := client.GetCurrentUser(ctx, &userpb.Empty{})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Map proto UserResponse to JSON shape expected by frontend (id, username, email, createdAt, updatedAt)
	c.JSON(http.StatusOK, gin.H{
		"id":        resp.GetUserId(),
		"username":  resp.GetUsername(),
		"email":     resp.GetEmail(),
		"role":      resp.GetRole(),
		"bio":       resp.GetBio(),
		"createdAt": "",
		"updatedAt": "",
	})
}

func updateProfileHandler(client userpb.UserServiceClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid authorization header"})
			return
		}

		var req userpb.UpdateProfileRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx := metadata.NewOutgoingContext(c.Request.Context(), metadata.Pairs("authorization", authHeader))
		resp, err := client.UpdateProfile(ctx, &req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"id":        resp.GetUserId(),
			"username":  resp.GetUsername(),
			"email":     resp.GetEmail(),
			"role":      resp.GetRole(),
			"bio":       resp.GetBio(),
			"createdAt": "",
			"updatedAt": "",
		})
	}
}

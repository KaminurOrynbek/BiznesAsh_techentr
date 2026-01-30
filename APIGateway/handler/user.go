package handler

import (
	"context"
	"net/http"
	"os"
	"strings"

	userpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/user"
	"github.com/gin-gonic/gin"
	jwt "github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func extractBearer(c *gin.Context) (string, bool) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return "", false
	}
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return "", false
	}
	return parts[1], true
}

func RegisterUserRoutes(r *gin.Engine, client userpb.UserServiceClient) {
	auth := r.Group("/auth")

	auth.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true, "src": "TECHENTR_HANDLER"})
	})

	auth.GET("/me", func(c *gin.Context) {
		tokenStr, ok := extractBearer(c)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "missing/invalid Authorization header"})
			return
		}

		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT_SECRET is not set in gateway env"})
			return
		}

		claims := &Claims{}
		_, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			// ensure HMAC (HS256)
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenSignatureInvalid
			}
			return []byte(secret), nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token", "details": err.Error()})
			return
		}

		// MVP response (frontend expects User-like object)
		c.JSON(http.StatusOK, gin.H{
			"id":       claims.UserID,
			"role":     claims.Role,
			"username": "",
			"email":    "",
		})
	})

	auth.POST("/register", func(c *gin.Context) {
		var req userpb.RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
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

package middleware

import (
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware returns a gin.HandlerFunc that applies CORS rules.
// It reads FRONTEND_URL from the environment; if unset it allows common dev origins.
func CORSMiddleware() gin.HandlerFunc {
	frontend := os.Getenv("FRONTEND_URL")
	var allowOrigins []string
	if frontend != "" {
		allowOrigins = []string{frontend}
	} else {
		allowOrigins = []string{"http://localhost:5173", "http://localhost:8080"}
	}

	cfg := cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	return cors.New(cfg)
}

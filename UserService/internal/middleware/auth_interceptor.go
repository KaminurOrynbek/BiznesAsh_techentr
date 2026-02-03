package middleware

import (
	"context"
	"log"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

func AuthInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	// Log the method name for debugging
	// log.Printf("AuthInterceptor: method=%s", info.FullMethod) // Uncommented only if user wants verbose logs, but let's uncomment it now for debugging
	log.Printf("AuthInterceptor: method=%s", info.FullMethod)

	// Пропускаем аутентификацию для публичных методов (relax check to suffix to avoid package name issues)
	if strings.HasSuffix(info.FullMethod, "/Register") ||
		strings.HasSuffix(info.FullMethod, "/Login") ||
		strings.HasSuffix(info.FullMethod, "/GetUser") ||
		strings.HasSuffix(info.FullMethod, "/ListUsers") {
		return handler(ctx, req)
	}

	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "missing metadata")
	}

	authHeader, ok := md["authorization"]
	if !ok || len(authHeader) == 0 {
		return nil, status.Errorf(codes.Unauthenticated, "[DEBUG] missing authorization header for method: %s", info.FullMethod)
	}

	tokenStr := authHeader[0]
	if !strings.HasPrefix(tokenStr, "Bearer ") {
		return nil, status.Errorf(codes.Unauthenticated, "invalid authorization header")
	}
	tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, status.Errorf(codes.Unauthenticated, "unexpected signing method")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		return nil, status.Errorf(codes.Unauthenticated, "invalid token: %v", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "invalid token claims")
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "missing userId in token")
	}

	role, ok := claims["role"].(string)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "missing role in token")
	}

	ctx = context.WithValue(ctx, "userId", userID)
	ctx = context.WithValue(ctx, "role", role)

	return handler(ctx, req)
}

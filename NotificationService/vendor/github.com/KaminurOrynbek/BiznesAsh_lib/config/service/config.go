package service

import (
	"os"
)

type Config struct {
	GrpcPort     string
	SMTPHost     string
	SMTPPort     string
	SMTPUsername string
	SMTPPassword string
	NatsURL      string
}

func LoadServiceConfig() *Config {
	return &Config{
		GrpcPort:     getEnv("GRPC_PORT", "50051"),
		SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUsername: getEnv("SMTP_USERNAME", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		NatsURL:      getEnv("NATS_URL", "nats://localhost:4222"),
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}

package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	handler "github.com/KaminurOrynbek/BiznesAsh/APIGateway/handler"
	contentpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/content"
	notificationpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/notification"
	userpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/user"

	conpb "github.com/KaminurOrynbek/BiznesAsh/ConsultationService/proto"
	paypb "github.com/KaminurOrynbek/BiznesAsh/PaymentService/proto"
	subpb "github.com/KaminurOrynbek/BiznesAsh/SubscriptionService/proto"
)

var banMismatchCounter = prometheus.NewCounterVec(
	prometheus.CounterOpts{
		Name: "user_ban_mismatch_total",
		Help: "Counts how often a user is marked for ban but their status remains false in DB.",
	},
	[]string{"user_id"},
)

func init() {
	prometheus.MustRegister(banMismatchCounter)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or error loading .env file")
	}

	userURL := os.Getenv("USER_SERVICE_URL")
	if userURL == "" {
		userURL = "localhost:8081"
	}
	userConn, err := grpc.Dial(userURL, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect to UserService: %v", err)
	}

	contentURL := os.Getenv("CONTENT_SERVICE_URL")
	if contentURL == "" {
		contentURL = "localhost:8082"
	}
	contentConn, err := grpc.Dial(contentURL, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect to ContentService: %v", err)
	}

	notificationURL := os.Getenv("NOTIFICATION_SERVICE_URL")
	if notificationURL == "" {
		notificationURL = "localhost:8083"
	}
	notificationConn, err := grpc.Dial(notificationURL, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect to NotificationService: %v", err)
	}

	subscriptionURL := os.Getenv("SUBSCRIPTION_SERVICE_URL")
	if subscriptionURL == "" {
		subscriptionURL = "localhost:8086"
	}
	subscriptionConn, err := grpc.Dial(subscriptionURL, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect to SubscriptionService: %v", err)
	}

	paymentURL := os.Getenv("PAYMENT_SERVICE_URL")
	if paymentURL == "" {
		paymentURL = "localhost:8087"
	}
	paymentConn, err := grpc.Dial(paymentURL, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect to PaymentService: %v", err)
	}

	consultationURL := os.Getenv("CONSULTATION_SERVICE_URL")
	if consultationURL == "" {
		consultationURL = "localhost:8088"
	}
	consultationConn, err := grpc.Dial(consultationURL, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect to ConsultationService: %v", err)
	}

	userClient := userpb.NewUserServiceClient(userConn)
	contentClient := contentpb.NewContentServiceClient(contentConn)
	notificationClient := notificationpb.NewNotificationServiceClient(notificationConn)
	subscriptionClient := subpb.NewSubscriptionServiceClient(subscriptionConn)
	paymentClient := paypb.NewPaymentServiceClient(paymentConn)
	consultationClient := conpb.NewConsultationServiceClient(consultationConn)

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	handler.RegisterUserRoutes(router, userClient)
	handler.RegisterContentRoutes(router, contentClient, userClient)
	handler.RegisterNotificationRoutes(router, notificationClient)
	handler.RegisterSubscriptionRoutes(router, subscriptionClient)
	handler.RegisterPaymentRoutes(router, paymentClient)
	handler.RegisterConsultationRoutes(router, consultationClient)

	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("REST API started at http://localhost:%s", port)
	router.Run(":" + port)
}

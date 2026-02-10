package main

import (
	"context"
	"github.com/KaminurOrynbek/BiznesAsh_lib/adapter/nats"
	natscfg "github.com/KaminurOrynbek/BiznesAsh_lib/config/nats"
	"github.com/KaminurOrynbek/BiznesAsh_lib/queue"

	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	"log"
	"net"
	"os"

	_ "github.com/lib/pq"
	"google.golang.org/grpc"

	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/nats/publisher"
	"github.com/KaminurOrynbek/BiznesAsh/internal/adapter/postgres/dao"
	"github.com/KaminurOrynbek/BiznesAsh_lib/config/postgres"

	redisclient "github.com/KaminurOrynbek/BiznesAsh_lib/adapter/redis"
	rediscfg "github.com/KaminurOrynbek/BiznesAsh_lib/config/redis"

	repoimpl "github.com/KaminurOrynbek/BiznesAsh/internal/repository/Impl"
	usecaseimpl "github.com/KaminurOrynbek/BiznesAsh/internal/usecase/impl"

	pb "github.com/KaminurOrynbek/BiznesAsh/auto-proto/content"
	handler "github.com/KaminurOrynbek/BiznesAsh/internal/delivery/grpc"
)

func init() {

	err := godotenv.Load(".env")
	if err != nil {
		log.Println(".env file not found in current dir, continuing...")
	} else {
		log.Println("env file loaded successfully")
	}
}

func main() {
	// 2. Init postgres
	// Загружаем конфигурацию
	pgConfig := postgres.LoadPostgresConfig()
	// Создаём подключение к БД
	db, err := sqlx.Connect("postgres", pgConfig.DSN())
	if err != nil {
		log.Fatalf("Failed to connect to Postgres: %v", err)
	}

	defer db.Close()

	cwd, _ := os.Getwd()
	log.Printf("CWD=%s\n", cwd)

	log.Println("Successfully connected to Postgres!")

	// DEBUG: check which DB + schema the service actually uses
	var dbName string
	var searchPath string
	var regclass *string

	if err := db.Get(&dbName, "select current_database()"); err != nil {
		log.Fatalf("failed to read current_database: %v", err)
	}
	if err := db.Get(&searchPath, "show search_path"); err != nil {
		log.Fatalf("failed to read search_path: %v", err)
	}

	if err := db.Get(&regclass, "select to_regclass('public.posts')"); err != nil {
		log.Fatalf("failed to read to_regclass: %v", err)
	}
	log.Printf("Connected DB: %s | search_path: %s | public.posts: %v\n", dbName, searchPath, regclass)

	// 3. Init Redis
	redisConfig := rediscfg.LoadRedisConfig()

	redisClient := redisclient.NewRedisClient(redisConfig.Addr, redisConfig.Password, redisConfig.DB)
	if err := redisClient.Ping(context.Background()); err != nil {
		log.Fatalf("Redis connection failed: %v", err)
	}
	log.Println("Connected to Redis successfully!")

	// 4. Init DAOs
	postDAO := dao.NewPostDAO(db)
	commentDAO := dao.NewCommentDAO(db)
	likeDAO := dao.NewLikeDao(db)

	// 5. Init Repositories
	postRepo := repoimpl.NewPostRepository(postDAO)
	commentRepo := repoimpl.NewCommentRepository(commentDAO)
	likeRepo := repoimpl.NewLikeRepository(likeDAO)

	// 6. Init Usecases
	postUsecase := usecaseimpl.NewPostUsecase(postRepo, commentRepo, likeRepo)

	// nats config (MOVED BEFORE using contentPublisher)
	natsConfig := natscfg.LoadNatsConfig()
	natsConn := nats.NewConnection(natsConfig)
	natsQueue := queue.NewNATSQueue(natsConn)

	contentPublisher := publisher.NewContentPublisher(natsQueue)

	commentUsecase := usecaseimpl.NewCommentUsecase(commentRepo, postRepo, likeRepo, contentPublisher)

	defer natsConn.Close()

	// 7. Init gRPC handler
	contentHandler := handler.NewContentHandler(postUsecase, commentUsecase, likeRepo)

	// 8. Start gRPC server
	port := os.Getenv("GRPC_PORT")
	if port == "" {
		port = "50055" // fallback if not set
	}
	lis, err := net.Listen("tcp", ":"+port)

	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterContentServiceServer(s, contentHandler)

	log.Printf("ENV GRPC_PORT=%q\n", os.Getenv("GRPC_PORT"))

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}

}

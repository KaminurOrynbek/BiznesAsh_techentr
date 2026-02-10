package main

import (
	"log"
	"net"
	"os"

	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	pgrpc "github.com/KaminurOrynbek/BiznesAsh/PaymentService/internal/delivery/grpc"
	"github.com/KaminurOrynbek/BiznesAsh/PaymentService/internal/repository"
	"github.com/KaminurOrynbek/BiznesAsh/PaymentService/internal/usecase"
	pb "github.com/KaminurOrynbek/BiznesAsh/PaymentService/proto"
)

func main() {
	_ = godotenv.Load()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:0000@localhost:5432/biznesAsh?sslmode=disable"
	}

	db, err := sqlx.Connect("postgres", dbURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	// Simple auto-migration
	migrationPath := "internal/migration/001_create_transactions_table.up.sql"
	migrationSQL, err := os.ReadFile(migrationPath)
	if err != nil {
		log.Printf("Warning: failed to read migration file %s: %v", migrationPath, err)
	} else {
		_, err = db.Exec(string(migrationSQL))
		if err != nil {
			log.Fatalf("failed to run migration: %v", err)
		}
		log.Println("Database migration completed successfully")
	}

	repo := repository.NewTransactionDAO(db)
	uc := usecase.NewPaymentUsecase(repo)
	server := pgrpc.NewPaymentServer(uc)

	port := os.Getenv("GRPC_PORT")
	if port == "" {
		port = "8087"
	}

	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterPaymentServiceServer(s, server)
	reflection.Register(s)

	log.Printf("PaymentService listening on port %s", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

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

	cgrpc "github.com/KaminurOrynbek/BiznesAsh/ConsultationService/internal/delivery/grpc"
	"github.com/KaminurOrynbek/BiznesAsh/ConsultationService/internal/repository"
	"github.com/KaminurOrynbek/BiznesAsh/ConsultationService/internal/usecase"
	pb "github.com/KaminurOrynbek/BiznesAsh/ConsultationService/proto"
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
	migrationPath := "internal/migration/001_create_consultations_tables.up.sql"
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

	repo := repository.NewConsultationDAO(db)
	uc := usecase.NewConsultationUsecase(repo)
	server := cgrpc.NewConsultationServer(uc)

	port := os.Getenv("GRPC_PORT")
	if port == "" {
		port = "8088"
	}

	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterConsultationServiceServer(s, server)
	reflection.Register(s)

	log.Printf("ConsultationService listening on port %s", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

package main

import (
	"context"
	"fmt"
	"log"
	"time"

	pb "github.com/KaminurOrynbek/BiznesAsh/UserService/auto-proto/user"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	conn, err := grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewUserServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

    fmt.Println("Calling ListUsers...")
	listResp, err := c.ListUsers(ctx, &pb.ListUsersRequest{SearchQuery: ""})
	if err != nil {
		log.Fatalf("could not list users: %v", err)
	}
    
    if len(listResp.Users) == 0 {
        fmt.Println("No users found")
        return
    }

    firstUser := listResp.Users[0]
    fmt.Printf("Found user in list: ID=%s, Username=%s\n", firstUser.UserId, firstUser.Username)

    fmt.Printf("Calling GetUser for ID: %s...\n", firstUser.UserId)
	r, err := c.GetUser(ctx, &pb.GetUserRequest{UserId: firstUser.UserId})
	if err != nil {
		log.Fatalf("could not get user: %v", err)
	}
	fmt.Printf("GetUser Response: Username=%s\n", r.GetUsername())
}

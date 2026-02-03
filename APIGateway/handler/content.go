package handler

import (
	"context"
	"log"
	"net/http"
	"strconv"
	"strings"

	contentpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/content"
	userpb "github.com/KaminurOrynbek/BiznesAsh_lib/proto/auto-proto/user"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/metadata"
)

func RegisterContentRoutes(r *gin.Engine, contentClient contentpb.ContentServiceClient, userClient userpb.UserServiceClient) {
	content := r.Group("/content")

	createPost := createPostHandler(contentClient, userClient)
	r.POST("/posts", createPost)       // frontend may call this (e.g. cached or env)
	content.POST("/posts", createPost) // canonical path

	// GET /content/posts - list posts (feed). Query: skip (default 0), limit (default 20)
	content.GET("/posts", func(c *gin.Context) {
		skip, _ := parseIntDefault(c.Query("skip"), 0)
		limit, _ := parseIntDefault(c.Query("limit"), 20)
		if limit <= 0 {
			limit = 20
		}
		if limit > 100 {
			limit = 100
		}
		page := skip/limit + 1
		resp, err := contentClient.ListPosts(context.Background(), &contentpb.ListPostsRequest{
			Page:  int32(page),
			Limit: int32(limit),
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		// Return posts array so frontend gets [ { id, content, ... }, ... ]
		posts := resp.GetPosts()
		authorMap := fetchUsernames(posts, nil, userClient)

		// Map to a structure including author name
		var enriched []gin.H
		for _, p := range posts {
			enriched = append(enriched, gin.H{
				"id":             p.GetId(),
				"content":        p.GetContent(),
				"authorId":       p.GetAuthorId(),
				"authorUsername": authorMap[p.GetAuthorId()],
				"likesCount":     p.GetLikesCount(),
				"commentsCount":  p.GetCommentsCount(),
				"createdAt":      p.GetCreatedAt(),
				"updatedAt":      p.GetUpdatedAt(),
			})
		}
		c.JSON(http.StatusOK, enriched)
	})

	content.GET("/posts/:id", func(c *gin.Context) {
		id := c.Param("id")
		resp, err := contentClient.GetPost(context.Background(), &contentpb.PostIdRequest{Id: id})
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		p := resp.GetPost()
		u, err := userClient.GetUser(context.Background(), &userpb.GetUserRequest{UserId: p.GetAuthorId()})
		if err != nil {
			log.Printf("Error fetching user %s: %v", p.GetAuthorId(), err)
		}
		c.JSON(http.StatusOK, gin.H{
			"id":             p.GetId(),
			"content":        p.GetContent(),
			"authorId":       p.GetAuthorId(),
			"authorUsername": u.GetUsername(),
			"likesCount":     p.GetLikesCount(),
			"commentsCount":  p.GetCommentsCount(),
			"createdAt":      p.GetCreatedAt(),
			"updatedAt":      p.GetUpdatedAt(),
		})
	})

	content.POST("/posts/:id/like", likePostHandler(contentClient, userClient))
	content.POST("/posts/:id/unlike", dislikePostHandler(contentClient, userClient))

	// Comment routes
	content.POST("/posts/:id/comments", createCommentHandler(contentClient, userClient))
	content.GET("/posts/:id/comments", listCommentsHandler(contentClient, userClient))
	content.DELETE("/comments/:id", deleteCommentHandler(contentClient, userClient))
}

// func createPostHandler(client contentpb.ContentServiceClient) gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		var req contentpb.CreatePostRequest
// 		if err := c.BindJSON(&req); err != nil {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 			return
// 		}
// 		resp, err := client.CreatePost(context.Background(), &req)
// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 			return
// 		}
// 		// Return the post object directly so frontend gets { id, content, ... } not { post: { ... } }
// 		c.JSON(http.StatusOK, resp.GetPost())
// 	}
// }

func createPostHandler(client contentpb.ContentServiceClient, userClient userpb.UserServiceClient) gin.HandlerFunc {
	return func(c *gin.Context) {
	  var req contentpb.CreatePostRequest
	  if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	  }
  
	  // get current user id from token
	  userID := getCurrentUserID(c, userClient)
	  if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization required"})
		return
	  }
  
	  req.AuthorId = userID
  
	  resp, err := client.CreatePost(context.Background(), &req)
	  if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	  }
  
	  p := resp.GetPost()
	  u, _ := userClient.GetUser(context.Background(), &userpb.GetUserRequest{UserId: p.GetAuthorId()})
	  c.JSON(http.StatusOK, gin.H{
		"id":             p.GetId(),
		"content":        p.GetContent(),
		"authorId":       p.GetAuthorId(),
		"authorUsername": u.GetUsername(),
		"createdAt":      p.GetCreatedAt(),
	  })
	}
  }
  

// getCurrentUserID returns the current user's ID from the Authorization header, or empty string if missing/invalid.
func getCurrentUserID(c *gin.Context, userClient userpb.UserServiceClient) string {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return ""
	}
	ctx := metadata.NewOutgoingContext(c.Request.Context(), metadata.Pairs("authorization", authHeader))
	resp, err := userClient.GetCurrentUser(ctx, &userpb.Empty{})
	if err != nil {
		return ""
	}
	return resp.GetUserId()
}

func likePostHandler(contentClient contentpb.ContentServiceClient, userClient userpb.UserServiceClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		postID := c.Param("id")
		if postID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "post id required"})
			return
		}
		userID := getCurrentUserID(c, userClient)
		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization required to like a post"})
			return
		}
		_, err := contentClient.LikePost(context.Background(), &contentpb.LikePostRequest{
			PostId: postID,
			UserId: userID,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		// Return updated post so frontend can replace list item
		postResp, err := contentClient.GetPost(context.Background(), &contentpb.PostIdRequest{Id: postID})
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"likesCount": 0})
			return
		}
		c.JSON(http.StatusOK, postResp.GetPost())
	}
}

func dislikePostHandler(contentClient contentpb.ContentServiceClient, userClient userpb.UserServiceClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		postID := c.Param("id")
		if postID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "post id required"})
			return
		}
		userID := getCurrentUserID(c, userClient)
		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization required to unlike a post"})
			return
		}
		_, err := contentClient.DislikePost(context.Background(), &contentpb.DislikePostRequest{
			PostId: postID,
			UserId: userID,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		postResp, err := contentClient.GetPost(context.Background(), &contentpb.PostIdRequest{Id: postID})
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"dislikesCount": 0})
			return
		}
		c.JSON(http.StatusOK, postResp.GetPost())
	}
}

func deleteCommentHandler(contentClient contentpb.ContentServiceClient, userClient userpb.UserServiceClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		commentID := c.Param("id")
		if commentID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "comment id required"})
			return
		}

		// Optional: verify authorship before deleting if backend doesn't handle it
		// For now we pass to backend
		_, err := contentClient.DeleteComment(context.Background(), &contentpb.CommentIdRequest{Id: commentID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "comment deleted"})
	}
}

func createCommentHandler(client contentpb.ContentServiceClient, userClient userpb.UserServiceClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		postID := c.Param("id")
		var req contentpb.CreateCommentRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userID := getCurrentUserID(c, userClient)
		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization required"})
			return
		}

		req.PostId = postID
		req.AuthorId = userID

		resp, err := client.CreateComment(context.Background(), &req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, resp.GetComment())
	}
}

func listCommentsHandler(client contentpb.ContentServiceClient, userClient userpb.UserServiceClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		postID := c.Param("id")
		resp, err := client.ListComments(context.Background(), &contentpb.ListCommentsRequest{PostId: postID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		comments := resp.GetComments()
		authorMap := fetchUsernames(nil, comments, userClient)

		var enriched []gin.H
		for _, com := range comments {
			enriched = append(enriched, gin.H{
				"id":             com.GetId(),
				"postId":         com.GetPostId(),
				"authorId":       com.GetAuthorId(),
				"authorUsername": authorMap[com.GetAuthorId()],
				"content":        com.GetContent(),
				"createdAt":      com.GetCreatedAt(),
				"updatedAt":      com.GetUpdatedAt(),
			})
		}

		c.JSON(http.StatusOK, enriched)
	}
}

func fetchUsernames(posts []*contentpb.Post, comments []*contentpb.Comment, userClient userpb.UserServiceClient) map[string]string {
	authorIDs := make(map[string]bool)
	for _, p := range posts {
		authorIDs[p.GetAuthorId()] = true
	}
	for _, c := range comments {
		authorIDs[c.GetAuthorId()] = true
	}

	res := make(map[string]string)
	for id := range authorIDs {
		u, err := userClient.GetUser(context.Background(), &userpb.GetUserRequest{UserId: id})
		if err == nil {
			displayName := u.GetUsername()
			if displayName == "" {
				displayName = "User " + id[:5] // fallback for missing username
			}
			res[id] = displayName
		} else {
			fallback := id
			if len(id) > 5 {
				fallback = id[:5]
			}
			res[id] = "User " + fallback
		}
	}
	return res
}

func parseIntDefault(s string, defaultVal int) (int, bool) {
	if s == "" {
		return defaultVal, false
	}
	n, err := strconv.Atoi(s)
	if err != nil {
		return defaultVal, false
	}
	return n, true
}

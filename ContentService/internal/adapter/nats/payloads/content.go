package payloads

type PostCreated struct {
	PostID   string `json:"post_id"`
	AuthorID string `json:"author_id"`
	Title    string `json:"title"`
}

type PostUpdated struct {
	PostID string `json:"post_id"`
	Title  string `json:"title"`
}

type CommentCreated struct {
	CommentID    string `json:"comment_id"`
	PostID       string `json:"post_id"`
	ActorID      string `json:"actor_id"`
	TargetUserID string `json:"target_user_id"`
	Content      string `json:"content"`
}

type PostReported struct {
	PostID     string `json:"post_id"`
	ReporterID string `json:"reporter_id"`
	Reason     string `json:"reason"`
}

type PostLiked struct {
	ActorID      string `json:"actor_id"`
	PostID       string `json:"post_id"`
	TargetUserID string `json:"target_user_id"`
}

type CommentLiked struct {
	ActorID      string `json:"actor_id"`
	CommentID    string `json:"comment_id"`
	TargetUserID string `json:"target_user_id"`
}

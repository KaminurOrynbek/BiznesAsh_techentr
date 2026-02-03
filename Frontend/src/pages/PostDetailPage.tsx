import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Navbar, Card, Loading, Alert, Button, TextArea } from "../components";
import type { Post, Comment } from "../services/contentService";
import { contentService } from "../services/contentService";

export const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const fetchPostData = useCallback(async () => {
    if (!postId) return;
    setIsLoading(true);

    try {
      const [postData, commentsData] = await Promise.all([
        contentService.getPostById(postId),
        contentService.getComments(postId),
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPostData();
    }
  }, [postId, fetchPostData]);

  const handleCreateComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postId || !newCommentContent.trim()) return;

    setIsCommenting(true);

    try {
      const newComment = await contentService.createComment(postId, {
        content: newCommentContent,
      });
      setComments((prev) => [...prev, newComment]);
      setNewCommentContent("");
    } catch {
      setError("Failed to create comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await contentService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError("Failed to delete comment");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        {isLoading ? (
          <Loading />
        ) : post ? (
          <>
            <Card className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-sm">
                  {(post.authorUsername?.[0] ?? "U").toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    {post.authorUsername || `User ${post.authorId.substring(0, 5)}`}
                  </div>
                  <div className="text-xs text-slate-500">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}
                  </div>
                </div>
              </div>

              <p className="text-gray-800 mb-6 whitespace-pre-wrap">{post.content}</p>

              <div className="flex items-center space-x-6 text-gray-500 text-sm border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1">👍 {post.likesCount} Likes</span>
                <span className="flex items-center gap-1">💬 {post.commentsCount} Comments</span>
              </div>
            </Card>

            <Card className="mb-8">
              <h3 className="text-lg font-bold mb-4">Add a Comment</h3>

              <form onSubmit={handleCreateComment} className="space-y-4">
                <TextArea
                  placeholder="Share your thoughts..."
                  value={newCommentContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewCommentContent(e.target.value)
                  }
                  disabled={isCommenting}
                  rows={3}
                />

                <Button type="submit" disabled={isCommenting || !newCommentContent.trim()}>
                  {isCommenting ? "Commenting..." : "Comment"}
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">Comments</h3>

              {comments.length === 0 ? (
                <p className="text-gray-600">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-[10px]">
                        {(comment.authorUsername?.[0] ?? "U").toUpperCase()}
                      </div>
                      <span className="font-bold text-sm text-slate-900">
                        {comment.authorUsername || `User ${comment.authorId.substring(0, 5)}`}
                      </span>
                    </div>

                    <p className="text-gray-800 mb-2">{comment.content}</p>

                    <div className="flex items-center justify-between text-gray-400 text-xs">
                      <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}</span>

                      <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment.id)} className="h-7 py-0 px-2 text-[10px]">
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        ) : (
          <Alert type="error" message="Post not found" />
        )}
      </div>
    </>
  );
};

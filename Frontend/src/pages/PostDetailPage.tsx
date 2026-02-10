import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar, Card, Loading, Alert, Button, TextArea } from "../components";
import type { Post, Comment } from "../services/contentService";
import { contentService } from "../services/contentService";
import { Trash2, MessageSquare, ThumbsUp } from "lucide-react";
import { useAuth } from "../context/useAuth";

export const PostDetailPage = () => {
  const { user } = useAuth();
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

  const handleLikePost = async () => {
    if (!post) return;
    try {
      const likesCount = await contentService.likePost(post.id);
      setPost({ ...post, likesCount, liked: true });
    } catch {
      setError("Failed to like post");
    }
  };

  const handleUnlikePost = async () => {
    if (!post) return;
    try {
      const likesCount = await contentService.unlikePost(post.id);
      setPost({ ...post, likesCount, liked: false });
    } catch {
      setError("Failed to unlike post");
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const likesCount = await contentService.likeComment(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likesCount, liked: true } : c
        )
      );
    } catch {
      setError("Failed to like comment");
    }
  };

  const handleUnlikeComment = async (commentId: string) => {
    try {
      const likesCount = await contentService.unlikeComment(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likesCount, liked: false } : c
        )
      );
    } catch {
      setError("Failed to unlike comment");
    }
  };

  const handleDeletePost = async () => {
    if (!post || !window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await contentService.deletePost(post.id);
      window.location.href = "/feed";
    } catch {
      setError("Failed to delete post");
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
            <Card className="mb-8 p-6 relative overflow-visible">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-sm">
                    {(post.authorUsername?.[0] ?? "U").toUpperCase()}
                  </div>
                  <div>
                    <Link
                      to={`/profile/${post.authorId}`}
                      className="font-semibold text-slate-900 hover:text-blue-600 hover:underline transition-colors block"
                    >
                      {post.authorUsername || `User ${post.authorId.substring(0, 5)}`}
                    </Link>
                    <div className="text-xs text-slate-500">
                      Founder • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}
                    </div>
                  </div>
                </div>

                {user && post.authorId === user.id && (
                  <button
                    onClick={handleDeletePost}
                    className="h-10 w-10 rounded-full hover:bg-red-50 flex items-center justify-center group transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 className="h-5 w-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                  </button>
                )}
              </div>

              <p className="text-gray-800 mb-4 whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                <div className="relative">
                  <Button
                    variant="ghost"
                    className={`transition-colors flex gap-2 ${post.liked ? "text-blue-600 bg-blue-50" : "hover:bg-slate-50"}`}
                    onClick={() => {
                      if (post.liked) {
                        handleUnlikePost();
                      } else {
                        handleLikePost();
                      }
                    }}
                  >
                    <ThumbsUp className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
                    <span className="font-medium">Like {post.likesCount > 0 && `(${post.likesCount})`}</span>
                  </Button>
                </div>
                <span className="flex items-center gap-2 text-gray-500 text-sm">
                  <MessageSquare className="h-4 w-4" /> {post.commentsCount} Comments
                </span>
              </div>
            </Card >

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
                comments.map((comment) => {
                  return (
                    <Card key={comment.id} className="relative overflow-visible">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-[10px]">
                            {(comment.authorUsername?.[0] ?? "U").toUpperCase()}
                          </div>
                          <Link
                            to={`/profile/${comment.authorId}`}
                            className="font-bold text-sm text-slate-900 hover:text-blue-600 hover:underline transition-colors"
                          >
                            {comment.authorUsername || `User ${comment.authorId.substring(0, 5)}`}
                          </Link>
                        </div>
                        {user && comment.authorId === user.id && (
                          <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment.id)} className="h-6 py-0 px-2 text-[10px]">
                            Delete
                          </Button>
                        )}
                      </div>

                      <p className="text-gray-800 mb-3">{comment.content}</p>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-2 grayscale-0">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <button
                              className={`text-xs font-medium flex items-center gap-1 hover:text-blue-600 transition-colors ${comment.liked ? "text-blue-600" : "text-gray-500"}`}
                              onClick={() => comment.liked ? handleUnlikeComment(comment.id) : handleLikeComment(comment.id)}
                            >
                              <ThumbsUp className={`h-3 w-3 ${comment.liked ? "fill-current" : ""}`} />
                              <span>Like {comment.likesCount > 0 && `(${comment.likesCount})`}</span>
                            </button>
                          </div>
                        </div>

                        <span className="text-gray-400 text-[10px]">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
                        </span>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <Alert type="error" message="Post not found" />
        )}
      </div >
    </>
  );
};

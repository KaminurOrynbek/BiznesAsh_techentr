import { useState, useEffect } from 'react';
import { Navbar, Card, Loading, Alert, Button, TextArea } from '../components';
import type { Post } from '../services/contentService';
import { contentService } from '../services/contentService';

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await contentService.getPosts();
      setPosts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load posts'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    try {
      const newPost = await contentService.createPost({
        content: newPostContent,
      });
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create post'
      );
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const updatedPost = await contentService.likePost(postId);
      setPosts(posts.map((p) => (p.id === postId ? updatedPost : p)));
    } catch {
      setError('Failed to like post');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">What's on your mind?</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <TextArea
              placeholder="Share your thoughts..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              disabled={isPosting}
              rows={4}
            />
            <Button
              type="submit"
              disabled={isPosting || !newPostContent.trim()}
              className="w-full"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </Button>
          </form>
        </Card>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <p className="text-gray-800 mb-4">{post.content}</p>
                <div className="flex items-center space-x-4 text-gray-600 text-sm">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="hover:text-blue-600 transition-colors"
                  >
                    👍 {post.likesCount} Likes
                  </button>
                  <span>💬 {post.commentsCount} Comments</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

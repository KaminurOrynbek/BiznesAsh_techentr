import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageSquare, Share2, MoreHorizontal, Send, Sparkles, Trash2, Search, X, ThumbsUp } from "lucide-react";

import { Card, Button, TextArea, Navbar, Loading, Alert } from "../components";
import { contentService, type Post } from "../services/contentService";
import { useAuth } from "../context/useAuth";


const TRENDING = ["#Registration", "#Taxes2026", "#Grants", "#Marketing", "#Hiring"];

export const FeedPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");


  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await contentService.getPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (topicFilter) {
      const needle = topicFilter.replace(/^#/, "").toLowerCase();
      result = result.filter((p) =>
        p.content.toLowerCase().includes(needle)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.content.toLowerCase().includes(q)
      );
    }

    return result;
  }, [posts, topicFilter, searchQuery]);

  const handlePost = async (): Promise<void> => {
    const text = newPostContent.trim();
    if (!text) return;

    try {
      const newPost = await contentService.createPost({ content: text });
      setPosts((prev) => [newPost, ...prev]);
      setNewPostContent("");
    } catch {
      setError("Failed to create post");
    }
  };

  const handleDelete = async (postId: string): Promise<void> => {
    if (!window.confirm(t('deletePostConfirm'))) return;
    try {
      await contentService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      setError("Failed to delete post");
    }
  };

  const handleLike = async (id: string): Promise<void> => {
    try {
      const likesCount = await contentService.likePost(id);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          return { ...p, likesCount, liked: true };
        })
      );
    } catch {
      setError("Failed to like post");
    }
  };

  const handleUnlike = async (id: string): Promise<void> => {
    try {
      const likesCount = await contentService.unlikePost(id);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          return { ...p, likesCount, liked: false };
        })
      );
    } catch {
      setError("Failed to unlike post");
    }
  };

  const initials = (s: string) => {
    if (!s) return "U";
    const parts = s.trim().split(" ");
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  };

  const HighlightText = ({ text, query }: { text: string; query: string }) => {
    if (!query.trim()) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-blue-100 text-blue-800 font-bold rounded-sm px-0.5">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                  {t('founderFeed')}
                </h1>
                <p className="mt-2 text-slate-600">
                  {t('feedSubtitle')}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-80">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {topicFilter && (
                  <Button
                    variant="secondary"
                    onClick={() => setTopicFilter(null)}
                    className="whitespace-nowrap rounded-full px-4"
                  >
                    {t('clearTopic')}
                  </Button>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-6">
                <Alert type="error" message={error} onClose={() => setError("")} />
              </div>
            )}

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card className="border border-slate-200 bg-white shadow-sm p-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                      ME
                    </div>
                    <div className="flex-1 space-y-4">
                      <TextArea
                        placeholder={t('shareIdeaPlaceholder')}
                        value={newPostContent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setNewPostContent(e.target.value)
                        }
                        rows={4}
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          {t('feedTip')}
                        </div>
                        <Button
                          variant="primary"
                          onClick={handlePost}
                          disabled={!newPostContent.trim()}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            {t('postButton')}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {isLoading && posts.length === 0 ? (
                  <Loading />
                ) : (
                  filteredPosts.map((post) => {
                    return (
                      <Card key={post.id} className="border border-slate-200 bg-white shadow-sm p-6 relative overflow-visible">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-sm">
                              {post.authorUsername ? initials(post.authorUsername) : initials(post.authorId)}
                            </div>
                            <div>
                              <Link
                                to={`/profile/${post.authorId}`}
                                className="font-semibold text-slate-900 hover:text-blue-600 hover:underline transition-colors"
                              >
                                {post.authorUsername || `User ${post.authorId.substring(0, 5)}`}
                              </Link>
                              <div className="text-xs text-slate-500">
                                Founder • {new Date(post.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {user && post.authorId === user.id && (
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="h-8 w-8 rounded-full hover:bg-red-50 flex items-center justify-center group"
                                title={t('deletePost')}
                              >
                                <Trash2 className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                              </button>
                            )}
                            <button
                              type="button"
                              className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
                              title="More"
                            >
                              <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </button>
                          </div>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-slate-800">
                          <HighlightText text={post.content} query={searchQuery} />
                        </p>



                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              className={`transition-colors flex gap-2 ${post.liked ? "text-blue-600 bg-blue-50" : "hover:bg-slate-50"}`}
                              onClick={() => {
                                if (post.liked) {
                                  handleUnlike(post.id);
                                } else {
                                  handleLike(post.id);
                                }
                              }}
                            >
                              <ThumbsUp className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
                              <span className="font-medium">{t('like')} {post.likesCount > 0 && `(${post.likesCount})`}</span>
                            </Button>
                          </div>

                          <Link to={`/post/${post.id}`}>
                            <Button variant="ghost">
                              <span className="inline-flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                {post.commentsCount} {t('comments')}
                              </span>
                            </Button>
                          </Link>

                          <Button variant="ghost">
                            <span className="inline-flex items-center gap-2">
                              <Share2 className="h-4 w-4" />
                              {t('share')}
                            </span>
                          </Button>
                        </div>
                      </Card>
                    );
                  })
                )}

                {!isLoading && filteredPosts.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-600">
                    {t('noPosts')}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <Card className="border border-slate-200 bg-white shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">{t('trendingTopics')}</h3>
                    <Sparkles className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTopicFilter(t)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="border-none bg-gradient-to-br from-blue-600 to-teal-600 text-white shadow-sm p-6">
                  <h3 className="text-lg font-bold">{t('needExpertHelp')}</h3>
                  <p className="mt-2 text-sm text-blue-100">{t('expertHelpSubtitle')}</p>
                  <div className="mt-5">
                    <Link to="/handbook">
                      <Button variant="secondary" className="w-full">{t('bookConsultation')}</Button>
                    </Link>
                  </div>
                </Card>

                <Card className="border border-slate-200 bg-white shadow-sm p-6">
                  <h4 className="font-semibold text-slate-900">{t('quickLinks')}</h4>
                  <div className="mt-3 grid gap-2 text-sm">
                    <Link to="/handbook" className="text-slate-600 hover:text-blue-600">{t('handbook')}</Link>
                    <Link to="/notifications" className="text-slate-600 hover:text-blue-600">{t('notifications')}</Link>
                    <Link to="/profile" className="text-slate-600 hover:text-blue-600">{t('yourProfile')}</Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageSquare, Share2, MoreHorizontal, Send, Sparkles, Trash2, Search, X, ThumbsUp, Image, FileText, BarChart3, Plus, Minus } from "lucide-react";

import { Card, Button, TextArea, Navbar, Loading, Alert } from "../components";
import { contentService, type Post, type Poll } from "../services/contentService";
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

  // New states for media and polls
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showPollEditor, setShowPollEditor] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);


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
    if (!text && selectedImages.length === 0 && selectedFiles.length === 0 && !showPollEditor) return;

    setIsSubmitting(true);
    try {
      // Mock image upload: convert to data URLs for now
      // In a real app, you'd upload to S3/Cloudinary and get back URLs
      const imageProms = selectedImages.map(f => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(f);
      }));
      const imageUrls = await Promise.all(imageProms);

      const fileProms = selectedFiles.map(f => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(f);
      }));
      const fileUrls = await Promise.all(fileProms);

      const postData: any = { content: text };
      if (imageUrls.length > 0) postData.images = imageUrls;
      if (fileUrls.length > 0) postData.files = fileUrls;
      if (showPollEditor && pollQuestion.trim()) {
        postData.poll = {
          question: pollQuestion,
          options: pollOptions.filter(o => o.trim() !== ""),
          durationHours: 24, // default
        };
      }

      const newPost = await contentService.createPost(postData);
      setPosts((prev) => [newPost, ...prev]);

      // Reset state
      setNewPostContent("");
      setSelectedImages([]);
      setSelectedFiles([]);
      setShowPollEditor(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
    } catch {
      setError("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleVote = async (postId: string, optionId: string) => {
    try {
      const updatedPoll = await contentService.votePoll(postId, optionId);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, poll: updatedPoll };
        }
        return p;
      }));
    } catch {
      setError("Failed to vote");
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

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {t('founderFeed')}
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
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
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all shadow-sm"
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
                <Card className="p-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-semibold text-sm">
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

                      {/* Image Previews */}
                      {selectedImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {selectedImages.map((file, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
                              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                              <button
                                onClick={() => setSelectedImages(prev => prev.filter((_, idx) => idx !== i))}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* File Previews */}
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {selectedFiles.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium dark:text-slate-300 truncate max-w-[200px]">{file.name}</span>
                              </div>
                              <button
                                onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Poll Editor */}
                      {showPollEditor && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold dark:text-white">{t('createPoll')}</h4>
                            <button onClick={() => setShowPollEditor(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                          </div>
                          <input
                            type="text"
                            placeholder={t('pollQuestionPlaceholder')}
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                          />
                          <div className="space-y-3">
                            {pollOptions.map((opt, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder={`${t('optionPlaceholder')} ${i + 1}`}
                                  value={opt}
                                  onChange={(e) => {
                                    const next = [...pollOptions];
                                    next[i] = e.target.value;
                                    setPollOptions(next);
                                  }}
                                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                                />
                                {pollOptions.length > 2 && (
                                  <button
                                    onClick={() => setPollOptions(prev => prev.filter((_, idx) => idx !== i))}
                                    className="text-slate-400 hover:text-red-500"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            {pollOptions.length < 4 && (
                              <button
                                onClick={() => setPollOptions(prev => [...prev, ""])}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" /> {t('addOption')}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="file"
                            id="post-image-upload"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          <label
                            htmlFor="post-image-upload"
                            className="h-9 w-9 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                            title={t('addImage')}
                          >
                            <Image className="h-5 w-5" />
                          </label>

                          <input
                            type="file"
                            id="post-file-upload"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <label
                            htmlFor="post-file-upload"
                            className="h-9 w-9 flex items-center justify-center rounded-full text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer transition-colors"
                            title={t('addFile')}
                          >
                            <FileText className="h-5 w-5" />
                          </label>

                          <button
                            onClick={() => setShowPollEditor(true)}
                            className="h-9 w-9 flex items-center justify-center rounded-full text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                            title={t('createPoll')}
                          >
                            <BarChart3 className="h-5 w-5" />
                          </button>
                        </div>
                        <Button
                          variant="primary"
                          onClick={handlePost}
                          disabled={isSubmitting || (!newPostContent.trim() && selectedImages.length === 0 && selectedFiles.length === 0 && !showPollEditor)}
                        >
                          <span className="inline-flex items-center gap-2">
                            {isSubmitting ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="h-4 w-4" />}
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
                      <Card key={post.id} className="p-6 relative overflow-visible">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-semibold text-sm transition-colors">
                              {post.authorUsername ? initials(post.authorUsername) : initials(post.authorId)}
                            </div>
                            <div>
                              <Link
                                to={`/profile/${post.authorId}`}
                                className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                              >
                                {post.authorUsername || `User ${post.authorId.substring(0, 5)}`}
                              </Link>
                              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Founder • {new Date(post.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {user && post.authorId === user.id && (
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="h-8 w-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center group transition-colors"
                                title={t('deletePost')}
                              >
                                <Trash2 className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                              </button>
                            )}
                            <button
                              type="button"
                              className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                              title="More"
                            >
                              <MoreHorizontal className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                            </button>
                          </div>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                          <HighlightText text={post.content} query={searchQuery} />
                        </p>

                        {/* Render Images */}
                        {post.images && post.images.length > 0 && (
                          <div className={`mt-4 grid gap-2 rounded-xl overflow-hidden ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {post.images.map((img, i) => (
                              <div key={i} className="aspect-video bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={img}
                                  alt=""
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Render Files */}
                        {post.files && post.files.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {post.files.map((file, i) => (
                              <a
                                key={i}
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                              >
                                <FileText className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium dark:text-slate-300">{t('attachment')} {i + 1}</span>
                                <Share2 className="h-4 w-4 ml-auto text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Render Poll */}
                        {post.poll && (
                          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                            <h4 className="font-semibold text-slate-900 dark:text-white">{post.poll.question}</h4>
                            <div className="space-y-2">
                              {post.poll.options.map((opt) => {
                                const percentage = post.poll?.totalVotes ? Math.round((opt.votesCount / post.poll.totalVotes) * 100) : 0;
                                const hasVoted = post.poll?.userVotedOptionId;
                                const isMyVote = post.poll?.userVotedOptionId === opt.id;

                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => !hasVoted && handleVote(post.id, opt.id)}
                                    disabled={!!hasVoted}
                                    className={`relative w-full p-3 text-left rounded-lg text-sm font-medium transition-all overflow-hidden border ${hasVoted ? 'cursor-default border-transparent' : 'hover:border-blue-500 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white'}`}
                                  >
                                    {hasVoted && (
                                      <div
                                        className={`absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 transition-all`}
                                        style={{ width: `${percentage}%` }}
                                      />
                                    )}
                                    <div className="relative flex justify-between items-center z-10">
                                      <span className="flex items-center gap-2">
                                        {opt.text}
                                        {isMyVote && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                                      </span>
                                      {hasVoted && <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{percentage}%</span>}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                              {post.poll.totalVotes} {t('totalVotes')} • {new Date(post.poll.expiresAt) > new Date() ? t('ongoing') : t('pollClosed')}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              className={`transition-colors flex gap-2 ${post.liked ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
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
                  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center text-slate-600 dark:text-slate-400 transition-colors">
                    {t('noPosts')}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">{t('trendingTopics')}</h3>
                    <Sparkles className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTopicFilter(t)}
                        className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
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

                <Card className="p-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white transition-colors">{t('quickLinks')}</h4>
                  <div className="mt-3 grid gap-2 text-sm">
                    <Link to="/handbook" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('handbook')}</Link>
                    <Link to="/notifications" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('notifications')}</Link>
                    <Link to="/profile" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('yourProfile')}</Link>
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



import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, Share2, MoreHorizontal, Send, Sparkles } from "lucide-react";

import { Card, Button, TextArea, Navbar } from "../components";

// --- Types
type Post = {
  id: number;
  author: string;
  role: string;
  avatar: string; // initials
  time: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
};

// --- Mock Data (replace with API later)
const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Almas K.",
    role: "Aspiring Founder",
    avatar: "AK",
    time: "2 hours ago",
    content:
      "Just registered my IE (Individual Entrepreneur) today via eGov! The process was surprisingly smooth. Does anyone have recommendations for a good local bank for business accounts?",
    tags: ["Registration", "Banking"],
    likes: 12,
    comments: 4,
  },
  {
    id: 2,
    author: "Dana S.",
    role: "Small Business Owner",
    avatar: "DS",
    time: "5 hours ago",
    content:
      "Thinking about switching from the simplified tax regime to retail tax. Has anyone done the math for a coffee shop with ~5M KZT monthly turnover?",
    tags: ["Taxes", "Coffee Shop"],
    likes: 8,
    comments: 7,
  },
  {
    id: 3,
    author: "Ruslan M.",
    role: "Tech Startup",
    avatar: "RM",
    time: "1 day ago",
    content:
      "Looking for a co-founder with marketing experience for a new EdTech project focused on language learning. PM me if interested!",
    tags: ["Co-founder", "EdTech"],
    likes: 24,
    comments: 2,
  },
];

const TRENDING = ["#Registration", "#Taxes2026", "#Grants", "#Marketing", "#Hiring"];

export const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [topicFilter, setTopicFilter] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!topicFilter) return posts;
    const needle = topicFilter.replace(/^#/, "").toLowerCase();
    return posts.filter((p) =>
      p.tags.some((t) => t.toLowerCase().includes(needle))
    );
  }, [posts, topicFilter]);

  const handlePost = (): void => {
    const text = newPostContent.trim();
    if (!text) return;

    const newPost: Post = {
      id: Date.now(),
      author: "You",
      role: "Founder",
      avatar: "ME",
      time: "Just now",
      content: text,
      tags: ["General"],
      likes: 0,
      comments: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent("");
  };

  const handleLike = (id: number): void => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const initials = (s: string) => {
    const parts = s.trim().split(" ");
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
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
                  Founder Feed
                </h1>
                <p className="mt-2 text-slate-600">
                  Connect, ask questions, and share your journey.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {topicFilter ? (
                  <Button
                    variant="secondary"
                    onClick={() => setTopicFilter(null)}
                  >
                    Clear filter
                  </Button>
                ) : null}
              </div>
            </div>

            {/* Content grid */}
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main feed */}
              <div className="space-y-6 lg:col-span-2">
                {/* Composer */}
                <Card className="border border-slate-200 bg-white shadow-sm p-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                      ME
                    </div>

                    <div className="flex-1 space-y-4">
                      <TextArea
                        placeholder="Share your idea or ask a question..."
                        value={newPostContent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setNewPostContent(e.target.value)
                        }
                        rows={4}
                      />

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          Tip: choose a topic on the right to filter
                        </div>

                        <Button
                          variant="primary"
                          onClick={handlePost}
                          disabled={!newPostContent.trim()}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Post
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Posts */}
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="border border-slate-200 bg-white shadow-sm p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                          {post.avatar || initials(post.author)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {post.author}
                          </div>
                          <div className="text-xs text-slate-500">
                            {post.role} • {post.time}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
                        title="More"
                      >
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-slate-800">
                      {post.content}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleLike(post.id)}
                      >
                        <span className="inline-flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4" />
                          {post.likes} Likes
                        </span>
                      </Button>

                      <Button variant="ghost">
                        <span className="inline-flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          {post.comments} Comments
                        </span>
                      </Button>

                      <Button variant="ghost">
                        <span className="inline-flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          Share
                        </span>
                      </Button>
                    </div>
                  </Card>
                ))}

                {filteredPosts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-600">
                    No posts match this topic yet.
                  </div>
                ) : null}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="border border-slate-200 bg-white shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Trending Topics
                    </h3>
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

                  {topicFilter ? (
                    <div className="mt-4 text-xs text-slate-500">
                      Filtered by{" "}
                      <span className="font-semibold text-slate-700">
                        {topicFilter}
                      </span>
                    </div>
                  ) : null}
                </Card>

                <Card className="border-none bg-gradient-to-br from-blue-600 to-teal-600 text-white shadow-sm p-6">
                  <h3 className="text-lg font-bold">Need expert help?</h3>
                  <p className="mt-2 text-sm text-blue-100">
                    Get a consultation with a legal or tax expert for your specific case.
                  </p>

                  <div className="mt-5">
                    <Link to="/handbook">
                      <Button variant="secondary" className="w-full">
                        Book Consultation
                      </Button>
                    </Link>
                  </div>

                  <p className="mt-3 text-[11px] text-blue-100/90">
                    (MVP) You can link this to a future booking page.
                  </p>
                </Card>

                <Card className="border border-slate-200 bg-white shadow-sm p-6">
                  <h4 className="font-semibold text-slate-900">Quick links</h4>
                  <div className="mt-3 grid gap-2 text-sm">
                    <Link to="/handbook" className="text-slate-600 hover:text-blue-600">
                      Entrepreneur’s Handbook
                    </Link>
                    <Link to="/notifications" className="text-slate-600 hover:text-blue-600">
                      Notifications
                    </Link>
                    <Link to="/profile" className="text-slate-600 hover:text-blue-600">
                      Your profile
                    </Link>
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

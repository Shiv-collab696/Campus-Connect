import React, { useState, useMemo } from 'react';
import { CommunityPost, Student, Comment } from '../types';
import { Search, Plus, ThumbsUp, MessageSquare, Tag, X, Send } from 'lucide-react';

interface CommunityBoardViewProps {
  posts: CommunityPost[];
  currentUser: Student;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onCreatePost: (newPost: Omit<CommunityPost, 'id' | 'likes' | 'isLiked' | 'date' | 'comments'>) => void;
}

export const CommunityBoardView: React.FC<CommunityBoardViewProps> = ({
  posts,
  currentUser,
  onToggleLike,
  onAddComment,
  onCreatePost,
}) => {
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({ 'post-1': true });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState<CommunityPost['channel']>('Academics & Study');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');

  const channels: string[] = [
    'All',
    'Academics & Study',
    'Campus Life',
    'Career & Internships',
    'Housing & Roommates',
    'Advice & Questions',
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));

      const matchesChannel = selectedChannel === 'All' || p.channel === selectedChannel;

      return matchesSearch && matchesChannel;
    });
  }, [posts, searchQuery, selectedChannel]);

  const toggleExpand = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onCreatePost({
      title: title.trim(),
      channel,
      content: content.trim(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        major: currentUser.major,
        year: currentUser.year.split(',')[0],
      },
      tags: tags.length > 0 ? tags : [channel, 'Campus'],
    });

    // Reset & close
    setTitle('');
    setContent('');
    setTagInput('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Deck */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Campus Forum & Q&A</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Student Community Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Share study tips, ask questions about course registration, post housing sublets, and discuss campus life.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Ask Question / Post</span>
        </button>
      </div>

      {/* Channels Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {channels.map((ch) => (
          <button
            key={ch}
            onClick={() => setSelectedChannel(ch)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedChannel === ch
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search discussions, questions, or tags (e.g. CS 2110, sublet, midterms)..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-hidden"
        />
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isExpanded = expandedComments[post.id] ?? false;
          return (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 transition-all"
            >
              {/* Author & Meta Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="text-xs min-w-0">
                    <span className="font-bold text-slate-900 block truncate">
                      {post.author.name}
                    </span>
                    {/* Unboxed metadata with typographic separators */}
                    <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                      <span>{post.author.major}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{post.author.year}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-sm shrink-0">
                  {post.channel}
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Tags unboxed */}
              <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.tags.join('  ·  ')}</span>
              </div>

              {/* Interaction Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      post.isLiked
                        ? 'text-blue-700 bg-blue-50 font-bold border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-blue-600' : ''}`} />
                    <span className="font-mono tabular-nums">{post.likes}</span>
                    <span>{post.likes === 1 ? 'Upvote' : 'Upvotes'}</span>
                  </button>

                  <button
                    onClick={() => toggleExpand(post.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{post.comments.length}</span>
                    <span>{post.comments.length === 1 ? 'Reply' : 'Replies'}</span>
                  </button>
                </div>

                <button
                  onClick={() => toggleExpand(post.id)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  {isExpanded ? 'Collapse replies' : 'View replies'}
                </button>
              </div>

              {/* Expanded Comments Thread */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 space-y-3 bg-slate-50/70 p-4 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Replies ({post.comments.length})
                  </h4>

                  {post.comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{comment.author}</span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <span>{comment.major}</span>
                          <span aria-hidden="true">·</span>
                          <span>{comment.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  ))}

                  {post.comments.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No replies yet. Be the first to share your thoughts!</p>
                  )}

                  {/* Comment Input */}
                  <form
                    onSubmit={(e) => handleCommentSubmit(post.id, e)}
                    className="flex items-center gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Write a helpful answer or tip..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={!(commentInputs[post.id] || '').trim()}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            No posts found in this channel
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Start a Discussion
          </button>
        </div>
      )}

      {/* New Post Modal */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Ask a Question or Post to Community
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Topic Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="Academics & Study">Academics & Study</option>
                  <option value="Campus Life">Campus Life</option>
                  <option value="Career & Internships">Career & Internships</option>
                  <option value="Housing & Roommates">Housing & Roommates</option>
                  <option value="Advice & Questions">Advice & Questions</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Post Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Best professors for ECON 3120? Or tips for prelim 1?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Details / Body Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide context, ask specific questions, or outline your study strategy..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Prelims, Study Tips, Library"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

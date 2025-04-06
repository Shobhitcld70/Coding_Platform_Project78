import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Filter, ThumbsUp, ThumbsDown, AlertCircle, X } from 'lucide-react';
import type { Discussion } from '../types';
import { useAuthStore } from '../stores/authStore';

const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: '1',
    title: 'How to implement binary search in Python?',
    content: 'I am trying to implement binary search in Python but facing some issues with the recursive approach. Here\'s my current implementation:\n\n```python\ndef binary_search(arr, target, low, high):\n    if high >= low:\n        mid = (high + low) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] > target:\n            return binary_search(arr, target, low, mid - 1)\n        else:\n            return binary_search(arr, target, mid + 1, high)\n    return -1\n```\n\nThe issue I\'m facing is...',
    author: {
      id: 'user-1',
      name: 'John Doe',
      avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
    },
    createdAt: '2024-03-15',
    tags: ['python', 'algorithms', 'searching'],
    votes: 5,
    votedBy: [],
    replies: [
      {
        id: 'reply-1',
        content: 'Your implementation looks good! Just make sure to handle edge cases.',
        author: {
          id: 'user-2',
          name: 'Jane Smith',
          avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
        },
        createdAt: '2024-03-15',
        votes: 2,
        votedBy: []
      }
    ],
  },
  {
    id: '2',
    title: 'React useEffect cleanup function',
    content: 'What is the proper way to clean up effects in React? I\'m particularly interested in handling WebSocket connections and event listeners.\n\n```javascript\nuseEffect(() => {\n  const ws = new WebSocket("ws://example.com");\n  ws.onmessage = (event) => {\n    // Handle message\n  };\n  \n  return () => {\n    ws.close();\n  };\n}, []);\n```\n\nIs this the correct approach?',
    author: {
      id: 'user-2',
      name: 'Jane Smith',
      avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
    },
    createdAt: '2024-03-14',
    tags: ['react', 'javascript', 'hooks'],
    votes: 8,
    votedBy: [],
    replies: [],
  },
];

interface NewDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discussion: Omit<Discussion, 'id' | 'votes' | 'replies' | 'votedBy' | 'author'>) => void;
}

function NewDiscussionModal({ isOpen, onClose, onSubmit }: NewDiscussionModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (selectedTags.length === 0) {
      setError('Please select at least one tag');
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      tags: selectedTags,
      createdAt: new Date().toISOString().split('T')[0],
    });

    setTitle('');
    setContent('');
    setSelectedTags([]);
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Start a Discussion</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="What would you like to discuss?"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={8}
              required
              placeholder="Describe your question or topic in detail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Post Discussion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const TAGS = [
  'javascript', 'python', 'java', 'react', 'algorithms', 'data-structures',
  'web-development', 'machine-learning', 'databases', 'security'
];

export default function DiscussionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discussions, setDiscussions] = useState<Discussion[]>(MOCK_DISCUSSIONS);
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => discussion.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleCreateDiscussion = (newDiscussion: Omit<Discussion, 'id' | 'votes' | 'replies' | 'votedBy' | 'author'>) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const discussion: Discussion = {
      ...newDiscussion,
      id: (discussions.length + 1).toString(),
      votes: 0,
      votedBy: [],
      replies: [],
      author: {
        id: user.id,
        name: user.user_metadata?.full_name || 'Anonymous',
        avatarUrl: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || '')}&background=random`
      }
    };
    setDiscussions(prev => [discussion, ...prev]);
  };

  const handleVote = (discussionId: string, isUpvote: boolean) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    setDiscussions(prev => prev.map(discussion => {
      if (discussion.id === discussionId) {
        const hasVoted = discussion.votedBy.includes(user.id);
        if (hasVoted) {
          // Remove vote
          return {
            ...discussion,
            votes: discussion.votes - 1,
            votedBy: discussion.votedBy.filter(id => id !== user.id)
          };
        } else {
          // Add vote
          return {
            ...discussion,
            votes: discussion.votes + 1,
            votedBy: [...discussion.votedBy, user.id]
          };
        }
      }
      return discussion;
    }));
  };

  const handleReplySubmit = (discussionId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    const newReply = {
      id: `reply-${Date.now()}`,
      content: replyContent.trim(),
      author: {
        id: user.id,
        name: user.user_metadata?.full_name || 'Anonymous',
        avatarUrl: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || '')}&background=random`
      },
      createdAt: new Date().toISOString().split('T')[0],
      votes: 0,
      votedBy: []
    };

    setDiscussions(prev => prev.map(discussion =>
      discussion.id === discussionId
        ? { ...discussion, replies: [...discussion.replies, newReply] }
        : discussion
    ));

    setReplyContent('');
    setShowReplyForm(null);
  };

  const handleReplyVote = (discussionId: string, replyId: string, isUpvote: boolean) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    setDiscussions(prev => prev.map(discussion => {
      if (discussion.id === discussionId) {
        return {
          ...discussion,
          replies: discussion.replies.map(reply => {
            if (reply.id === replyId) {
              const hasVoted = reply.votedBy.includes(user.id);
              if (hasVoted) {
                return {
                  ...reply,
                  votes: reply.votes - 1,
                  votedBy: reply.votedBy.filter(id => id !== user.id)
                };
              } else {
                return {
                  ...reply,
                  votes: reply.votes + 1,
                  votedBy: [...reply.votedBy, user.id]
                };
              }
            }
            return reply;
          })
        };
      }
      return discussion;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Start Discussion
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="h-5 w-5" />
          Filter
        </button>
      </div>

      {isFilterOpen && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Filter by Tags</h3>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTags(prev =>
                  prev.includes(tag)
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                )}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <div key={discussion.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start gap-4">
              <img
                src={discussion.author.avatarUrl}
                alt={discussion.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{discussion.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>{discussion.author.name}</span>
                  <span>•</span>
                  <span>{discussion.createdAt}</span>
                </div>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">{discussion.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVote(discussion.id, true)}
                        className={`p-1 rounded-full ${
                          user && discussion.votedBy.includes(user.id)
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </button>
                      <span className="text-gray-600">{discussion.votes}</span>
                    </div>
                    <button
                      onClick={() => setShowReplyForm(showReplyForm === discussion.id ? null : discussion.id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>{discussion.replies.length} replies</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {discussion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Replies Section */}
                {(showReplyForm === discussion.id || discussion.replies.length > 0) && (
                  <div className="mt-6 space-y-4 border-t pt-4">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-4">
                        <img
                          src={reply.author.avatarUrl}
                          alt={reply.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{reply.author.name}</span>
                            <span className="text-sm text-gray-500">{reply.createdAt}</span>
                          </div>
                          <p className="text-gray-600">{reply.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleReplyVote(discussion.id, reply.id, true)}
                              className={`p-1 rounded-full ${
                                user && reply.votedBy.includes(user.id)
                                  ? 'text-blue-600 bg-blue-50'
                                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </button>
                            <span className="text-sm text-gray-600">{reply.votes}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {showReplyForm === discussion.id && (
                      <form onSubmit={(e) => handleReplySubmit(discussion.id, e)} className="mt-4">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write your reply..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          required
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowReplyForm(null);
                              setReplyContent('');
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Reply
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewDiscussionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDiscussion}
      />
    </div>
  );
}
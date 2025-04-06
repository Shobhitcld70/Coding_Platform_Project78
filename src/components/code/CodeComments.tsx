import { useState } from 'react';
import { MessageSquare, Heart, Send, Pencil, Trash2, X, Check } from 'lucide-react';
import type { Comment } from '../../types';

interface CodeCommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onLikeComment: (commentId: string) => void;
  currentUserId: string;
}

export default function CodeComments({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  currentUserId
}: CodeCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [editingContent, setEditingContent] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingContent({ ...editingContent, [comment.id]: comment.content });
  };

  const cancelEditing = (commentId: string) => {
    const newEditingContent = { ...editingContent };
    delete newEditingContent[commentId];
    setEditingContent(newEditingContent);
  };

  const saveEdit = (commentId: string) => {
    const content = editingContent[commentId];
    if (content && content.trim()) {
      onEditComment(commentId, content.trim());
      cancelEditing(commentId);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 text-gray-600">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium">{comment.author}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLikeComment(comment.id)}
                  disabled={comment.likedBy.includes(currentUserId)}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart
                    className="h-4 w-4"
                    fill={comment.likedBy.includes(currentUserId) ? "currentColor" : "none"}
                  />
                  <span className="text-sm">{comment.likes}</span>
                </button>
                {comment.author === currentUserId && (
                  <>
                    {editingContent[comment.id] ? (
                      <>
                        <button
                          onClick={() => saveEdit(comment.id)}
                          className="p-1 text-green-600 hover:text-green-700 rounded-full hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => cancelEditing(comment.id)}
                          className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(comment)}
                          className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            {editingContent[comment.id] ? (
              <input
                type="text"
                value={editingContent[comment.id]}
                onChange={(e) => setEditingContent({
                  ...editingContent,
                  [comment.id]: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-700">{comment.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
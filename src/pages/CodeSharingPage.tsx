import { useState, useEffect } from 'react';
import { Search, Filter, ThumbsUp, Play, Pencil, Trash2, Heart, MessageSquare, Code2 } from 'lucide-react';
import type { CodeSnippet, Comment } from '../types';
import ShareCodeModal from '../components/code/ShareCodeModal';
import CodeCompiler from '../components/code/CodeCompiler';
import CodeComments from '../components/code/CodeComments';
import AIAssistant from '../components/ai/AIAssistant';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeAnalytics from '../components/code/CodeAnalytics';
import { useAuthStore } from '../stores/authStore';
import { useLeaderboardStore } from '../stores/leaderboardStore';
import { supabase } from '../lib/supabase';

export default function CodeSharingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('code_snippets')
        .select(`
          *,
          author:users(id, full_name, avatar_url),
          comments(
            id,
            content,
            created_at,
            author:users(id, full_name, avatar_url),
            likes_count,
            liked_by:likes(user_id)
          ),
          liked_by:likes(user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedSnippets = data.map(snippet => ({
        id: snippet.id,
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        author: {
          id: snippet.author.id,
          name: snippet.author.full_name,
          avatarUrl: snippet.author.avatar_url
        },
        createdAt: snippet.created_at,
        likes: snippet.liked_by.length,
        likedBy: snippet.liked_by.map((like: any) => like.user_id),
        comments: snippet.comments.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          author: comment.author.full_name,
          createdAt: comment.created_at,
          likes: comment.likes_count,
          likedBy: comment.liked_by.map((like: any) => like.user_id)
        }))
      }));

      setSnippets(formattedSnippets);
    } catch (err: any) {
      console.error('Error fetching snippets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnippet = async (snippet: Omit<CodeSnippet, 'id' | 'author' | 'createdAt' | 'likes' | 'comments' | 'likedBy'>) => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('code_snippets')
        .insert([{
          ...snippet,
          author_id: user.id
        }])
        .select(`
          *,
          author:users(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      const newSnippet: CodeSnippet = {
        id: data.id,
        title: data.title,
        description: data.description,
        code: data.code,
        language: data.language,
        author: {
          id: data.author.id,
          name: data.author.full_name,
          avatarUrl: data.author.avatar_url
        },
        createdAt: data.created_at,
        likes: 0,
        likedBy: [],
        comments: []
      };

      setSnippets(prev => [newSnippet, ...prev]);
    } catch (err: any) {
      console.error('Error creating snippet:', err);
      setError(err.message);
    }
  };

  const handleUpdateSnippet = async (id: string, updates: Partial<CodeSnippet>) => {
    try {
      const { error } = await supabase
        .from('code_snippets')
        .update({
          title: updates.title,
          description: updates.description,
          code: updates.code,
          language: updates.language
        })
        .eq('id', id);

      if (error) throw error;

      setSnippets(prev =>
        prev.map(snippet =>
          snippet.id === id
            ? { ...snippet, ...updates }
            : snippet
        )
      );

      setEditingSnippet(null);
    } catch (err: any) {
      console.error('Error updating snippet:', err);
      setError(err.message);
    }
  };

  const handleDeleteSnippet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('code_snippets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSnippets(prev => prev.filter(snippet => snippet.id !== id));
    } catch (err: any) {
      console.error('Error deleting snippet:', err);
      setError(err.message);
    }
  };

  const handleLikeSnippet = async (snippetId: string) => {
    if (!user) return;

    try {
      const isLiked = snippets.find(s => s.id === snippetId)?.likedBy.includes(user.id);

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ snippet_id: snippetId, user_id: user.id });

        if (error) throw error;

        setSnippets(prev =>
          prev.map(snippet =>
            snippet.id === snippetId
              ? {
                  ...snippet,
                  likes: snippet.likes - 1,
                  likedBy: snippet.likedBy.filter(id => id !== user.id)
                }
              : snippet
          )
        );
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert([{ snippet_id: snippetId, user_id: user.id }]);

        if (error) throw error;

        setSnippets(prev =>
          prev.map(snippet =>
            snippet.id === snippetId
              ? {
                  ...snippet,
                  likes: snippet.likes + 1,
                  likedBy: [...snippet.likedBy, user.id]
                }
              : snippet
          )
        );
      }
    } catch (err: any) {
      console.error('Error liking snippet:', err);
      setError(err.message);
    }
  };

  const handleAddComment = async (snippetId: string, content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          snippet_id: snippetId,
          content,
          author_id: user.id
        }])
        .select(`
          *,
          author:users(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      const newComment: Comment = {
        id: data.id,
        content: data.content,
        author: data.author.full_name,
        createdAt: data.created_at,
        likes: 0,
        likedBy: []
      };

      setSnippets(prev =>
        prev.map(snippet =>
          snippet.id === snippetId
            ? { ...snippet, comments: [...snippet.comments, newComment] }
            : snippet
        )
      );
    } catch (err: any) {
      console.error('Error adding comment:', err);
      setError(err.message);
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId);

      if (error) throw error;

      setSnippets(prev =>
        prev.map(snippet => ({
          ...snippet,
          comments: snippet.comments.map(comment =>
            comment.id === commentId
              ? { ...comment, content }
              : comment
          )
        }))
      );
    } catch (err: any) {
      console.error('Error editing comment:', err);
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setSnippets(prev =>
        prev.map(snippet => ({
          ...snippet,
          comments: snippet.comments.filter(comment => comment.id !== commentId)
        }))
      );
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      setError(err.message);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('likes')
        .insert([{ comment_id: commentId, user_id: user.id }]);

      if (error) throw error;

      setSnippets(prev =>
        prev.map(snippet => ({
          ...snippet,
          comments: snippet.comments.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes: comment.likes + 1,
                  likedBy: [...comment.likedBy, user.id]
                }
              : comment
          )
        }))
      );
    } catch (err: any) {
      console.error('Error liking comment:', err);
      setError(err.message);
    }
  };

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = 
      selectedLanguages.length === 0 || 
      selectedLanguages.includes(snippet.language);
    
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Code Sharing</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Share Code
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search code snippets..."
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
          <h3 className="text-lg font-semibold mb-4">Filter by Language</h3>
          <div className="flex flex-wrap gap-2">
            {['javascript', 'python', 'typescript', 'java', 'cpp', 'csharp'].map(language => (
              <button
                key={language}
                onClick={() => setSelectedLanguages(prev =>
                  prev.includes(language)
                    ? prev.filter(l => l !== language)
                    : [...prev, language]
                )}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedLanguages.includes(language)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading code snippets...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Code2 className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchSnippets}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredSnippets.length === 0 ? (
          <div className="text-center py-12">
            <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No code snippets found</p>
          </div>
        ) : (
          filteredSnippets.map((snippet) => (
            <div key={snippet.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <img
                  src={snippet.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(snippet.author.name)}&background=random`}
                  alt={snippet.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{snippet.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{snippet.author.name}</span>
                        <span>•</span>
                        <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {snippet.language}
                        </span>
                      </div>
                    </div>
                    {user && snippet.author.id === user.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingSnippet(snippet)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSnippet(snippet.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-gray-600">{snippet.description}</p>

                  <div className="mt-4 relative rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language={snippet.language}
                      style={vs}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: '#1e1e1e',
                      }}
                    >
                      {snippet.code}
                    </SyntaxHighlighter>
                  </div>

                  <CodeAnalytics code={snippet.code} language={snippet.language} />
                  <CodeCompiler code={snippet.code} language={snippet.language} />

                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={() => handleLikeSnippet(snippet.id)}
                      className={`flex items-center gap-1 ${
                        user && snippet.likedBy.includes(user.id)
                          ? 'text-red-600'
                          : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <Heart
                        className="h-5 w-5"
                        fill={user && snippet.likedBy.includes(user.id) ? 'currentColor' : 'none'}
                      />
                      <span>{snippet.likes}</span>
                    </button>
                    <button
                      onClick={() => {}}
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>{snippet.comments.length} comments</span>
                    </button>
                  </div>

                  <CodeComments
                    comments={snippet.comments}
                    onAddComment={(content) => handleAddComment(snippet.id, content)}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    onLikeComment={handleLikeComment}
                    currentUserId={user?.id || ''}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ShareCodeModal
        isOpen={isModalOpen || editingSnippet !== null}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSnippet(null);
        }}
        onSubmit={(snippet) => {
          if (editingSnippet) {
            handleUpdateSnippet(editingSnippet.id, snippet);
          } else {
            handleCreateSnippet(snippet);
          }
        }}
        editingSnippet={editingSnippet}
      />
    </div>
  );
}
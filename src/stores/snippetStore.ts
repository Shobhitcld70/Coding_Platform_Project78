import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { CodeSnippet, Comment } from '../types';

interface SnippetState {
  snippets: CodeSnippet[];
  loading: boolean;
  error: string | null;
  fetchSnippets: () => Promise<void>;
  createSnippet: (snippet: Omit<CodeSnippet, 'id' | 'author' | 'createdAt' | 'likes' | 'comments' | 'likedBy'>) => Promise<void>;
  updateSnippet: (id: string, updates: Partial<CodeSnippet>) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  likeSnippet: (snippetId: string, userId: string) => Promise<void>;
  unlikeSnippet: (snippetId: string, userId: string) => Promise<void>;
  addComment: (snippetId: string, content: string, userId: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (commentId: string, userId: string) => Promise<void>;
  unlikeComment: (commentId: string, userId: string) => Promise<void>;
}

export const useSnippetStore = create<SnippetState>((set, get) => ({
  snippets: [],
  loading: false,
  error: null,

  fetchSnippets: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .select(`
          *,
          author:users(id, full_name, avatar_url),
          comments(
            id,
            content,
            created_at,
            likes,
            author:users(id, full_name)
          ),
          likes(user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const snippets = data.map(snippet => ({
        id: snippet.id,
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        author: snippet.author.full_name,
        createdAt: snippet.created_at,
        likes: snippet.likes,
        likedBy: snippet.likes.map((like: any) => like.user_id),
        comments: snippet.comments.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          author: comment.author.full_name,
          createdAt: comment.created_at,
          likes: comment.likes,
          likedBy: []
        }))
      }));

      set({ snippets, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createSnippet: async (snippet) => {
    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .insert([snippet])
        .select()
        .single();

      if (error) throw error;

      const { snippets } = get();
      set({ snippets: [data, ...snippets] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateSnippet: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const { snippets } = get();
      set({
        snippets: snippets.map(snippet =>
          snippet.id === id ? { ...snippet, ...data } : snippet
        )
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteSnippet: async (id) => {
    try {
      const { error } = await supabase
        .from('code_snippets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { snippets } = get();
      set({ snippets: snippets.filter(snippet => snippet.id !== id) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  likeSnippet: async (snippetId, userId) => {
    try {
      const { error } = await supabase
        .from('likes')
        .insert([{ snippet_id: snippetId, user_id: userId }]);

      if (error) throw error;

      await get().fetchSnippets();
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  unlikeSnippet: async (snippetId, userId) => {
    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .match({ snippet_id: snippetId, user_id: userId });

      if (error) throw error;

      await get().fetchSnippets();
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addComment: async (snippetId, content, userId) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          snippet_id: snippetId,
          content,
          author_id: userId
        }])
        .select(`
          *,
          author:users(id, full_name)
        `)
        .single();

      if (error) throw error;

      const { snippets } = get();
      set({
        snippets: snippets.map(snippet =>
          snippet.id === snippetId
            ? {
                ...snippet,
                comments: [
                  {
                    id: data.id,
                    content: data.content,
                    author: data.author.full_name,
                    createdAt: data.created_at,
                    likes: 0,
                    likedBy: []
                  },
                  ...snippet.comments
                ]
              }
            : snippet
        )
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateComment: async (commentId, content) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;

      const { snippets } = get();
      set({
        snippets: snippets.map(snippet => ({
          ...snippet,
          comments: snippet.comments.map(comment =>
            comment.id === commentId
              ? { ...comment, content: data.content }
              : comment
          )
        }))
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteComment: async (commentId) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      const { snippets } = get();
      set({
        snippets: snippets.map(snippet => ({
          ...snippet,
          comments: snippet.comments.filter(comment => comment.id !== commentId)
        }))
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  likeComment: async (commentId, userId) => {
    try {
      const { error } = await supabase
        .from('likes')
        .insert([{ comment_id: commentId, user_id: userId }]);

      if (error) throw error;

      await get().fetchSnippets();
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  unlikeComment: async (commentId, userId) => {
    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .match({ comment_id: commentId, user_id: userId });

      if (error) throw error;

      await get().fetchSnippets();
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
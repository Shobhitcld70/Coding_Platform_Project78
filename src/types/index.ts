export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: string;
  tags: string[];
  votes: number;
  votedBy: string[];
  replies: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: string;
  votes: number;
  votedBy: string[];
}

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  isEditing?: boolean;
}

export interface LeaderboardUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  points: number;
  level: number;
  rank: number;
  snippets_count: number;
  comments_count: number;
  badges: Badge[];
  badges_count: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface PointTransaction {
  id: string;
  amount: number;
  action_type: string;
  created_at: string;
}
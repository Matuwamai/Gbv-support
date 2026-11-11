export type Gender = "MALE" | "FEMALE" | "OTHER";
export type Reaction = "LIKE" | "DISLIKE";

export interface UserSummary {
  id: number;
  name: string;
  profileImage?: string | null;
}

export interface UserProfile extends UserSummary {
  email: string;
  role?: "USER" | "ADMIN" | "MODERATOR";
  gender: Gender;
  birthday: string;
  contact?: string | null;
  createdAt: string;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  mediaUrl?: string | null;
  createdAt: string;
  user: UserSummary;
  _count?: { comments: number; reposts: number };
}

export interface Repost {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  user: UserSummary;
  post: Omit<Post, "_count">;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: UserSummary;
}

export interface ReactionSummary {
  likes: number;
  dislikes: number;
  userReaction: Reaction | null;
}

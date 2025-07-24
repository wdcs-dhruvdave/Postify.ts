export type PostAuthor = {
  name: string;
  username: string;
  avatar_url: string;
};

export type Post = {
  id: string;
  author: PostAuthor; 
  title: string;
  content_text: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  dislikes_count: number;
};

export type PostFormData = {
  title: string;
  content_text: string;
  image_url?: string;
  category_id?: string;
};
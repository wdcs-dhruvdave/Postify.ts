import { PostAuthor } from './post.types';

export interface Comment {
  id: string;
  content_text: string;
  created_at: string;
  author: PostAuthor;
}
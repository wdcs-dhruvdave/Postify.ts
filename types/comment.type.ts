import { PublicUser } from "./user.type"; // Or your correct path to user types

export interface Comment {
  id: string;
  content_text: string;
  created_at: string;
  author: PublicUser;
  parent_id?: string | null;
  replies?: Comment[];
}

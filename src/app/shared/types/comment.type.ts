/**
 * describes a comment under a post
 */
export type Comment = {
  id: number;
  idPost: number;
  idAuthor: number;
  content: string;
};

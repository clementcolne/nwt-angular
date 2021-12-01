/**
 * describes a post
 */
export type Post = {
  id: number,
  idAuthor: number,
  media: string,
  mediaType: string,
  description?: string,
  likes: number,
  location?: string,
  nbComments: number
}

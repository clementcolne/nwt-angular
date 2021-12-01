/**
 * describes a user
 */
export type User = {
  id: number;
  username: string;
  email: string;
  profilePicture: string;
  description: string;
  nbFollow: number;
  nbFollowers: number;
  isPrivate: boolean;
};

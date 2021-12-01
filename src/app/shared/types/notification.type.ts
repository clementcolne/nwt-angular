/**
 * describes a notification
 */
export type Notification = {
  id: number;
  recipient: number;
  author: number;
  content: string;
  type: string;
  date: number;
  isRead: boolean;
};

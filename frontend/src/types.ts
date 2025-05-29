export interface FollowedUser {
  userId: string;
  username: string;
  selectedField: string;
}

export interface User {
  userId: string;
  username: string;
  selectedField: string;
  // Add any other properties that are relevant
}

export interface NotificationType {
  _id: string; // Unique identifier for the notification
  userId: string; // ID of the user who receives the notification
  message: string; // Notification message
  isRead: boolean; // Status of the notification
  createdAt: Date; // Timestamp of the notification
}

export default User
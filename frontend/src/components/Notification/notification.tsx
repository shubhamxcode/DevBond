// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../Redux/store';

// // Define the Notification type
// interface Notification {
//   _id: string; // Unique identifier for the notification
//   follower: {
//     username: string; // Username of the follower
//   };
//   status: "pending" | "accepted" | "rejected"; // Status of the follow request
// }

// const Notifications: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const currentUserId = useSelector((state: RootState) => state.userProfile.userId);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get('/api/users/notifications');
//         setNotifications(response.data);
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (currentUserId) {
//       fetchNotifications();
//     }
//   }, [currentUserId]);

//   const handleAccept = async (notificationId: string) => {
//     try {
//       await axios.post('/api/users/followreq/accept', {
//         userId: notificationId,
//         status: 'accepted',
//       });
//       setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
//     } catch (error) {
//       console.error('Error accepting follow request:', error);
//     }
//   };

//   const handleReject = async (notificationId: string) => {
//     try {
//       await axios.post('/api/users/followreq/accept', {
//         userId: notificationId,
//         status: 'rejected',
//       });
//       setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
//     } catch (error) {
//       console.error('Error rejecting follow request:', error);
//     }
//   };

//   if (loading) return <p>Loading notifications...</p>;

//   return (
//     <div>
//       <h2>Notifications</h2>
//       {notifications.length === 0 ? (
//         <p>No notifications</p>
//       ) : (
//         <ul>
//           {notifications.map((notification) => (
//             <li key={notification._id}>
//               <p>{notification.follower.username} wants to follow you.</p>
//               <button onClick={() => handleAccept(notification._id)}>Accept</button>
//               <button onClick={() => handleReject(notification._id)}>Reject</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notifications;
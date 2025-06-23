import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { followUser } from '../Slices/userslice';

interface FollowButtonProps {
  UserIdtoFollow: string;
  username?: string;
  selectedField?: string;
}

type FollowStatus = 'not_following' | 'pending' | 'following' | 'loading' | 'error' | 'incoming_request';

const FollowButton: React.FC<FollowButtonProps> = ({ UserIdtoFollow, username, selectedField }) => {
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);
  const dispatch = useDispatch();
  const [status, setStatus] = useState<FollowStatus>('not_following');
  const [error, setError] = useState('');

  // Check the current follow status when component mounts
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!accessToken) return;
      
      try {
        setStatus('loading');
        
        // Get follow status from backend
        const response = await axios.get(`/api/users/follow-status/${UserIdtoFollow}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        const { status, direction } = response.data.data;
        
        // Handle different follow statuses
        if (status === 'accepted') {
          setStatus('following');
        } else if (status === 'pending') {
          // Check if it's an incoming or outgoing request
          if (direction === 'incoming') {
            setStatus('incoming_request');
          } else {
            setStatus('pending');
          }
        } else {
          setStatus('not_following');
        }
                 
      } catch (err) {
        console.error('Error checking follow status:', err);
        setStatus('not_following');
      }
    };
    
    checkFollowStatus();
  }, [UserIdtoFollow, accessToken]);

  const handleFollow = async () => {
    if (!accessToken) {
      setError('You need to be logged in to follow users.');
      return;
    }
    
    setStatus('loading');
    setError('');

    try {
      // Send follow request
      const response = await axios.post(`/api/users/followreq`, 
        { userIdToFollow: UserIdtoFollow },
        { headers: { 'Authorization': `Bearer ${accessToken}` }}
      );
      
      console.log('Follow request response:', response.data);
      
      // Update button state based on response
      if (response.data.success) {
        setStatus('pending');
      }
    } catch (err: unknown) {
      // Extract the error message from the response if available
      const error = err as Error & { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Failed to send follow request';
      
      // Handle the case where the request already exists
      if (errorMessage.includes('already exists')) {
        setStatus('pending');
      } else {
        setStatus('error');
        setError(errorMessage);
      }
      
      console.error('Error sending follow request:', err);
    }
  };

  const handleUnfollow = async () => {
    if (!accessToken) return;
    
    setStatus('loading');
    setError('');

    try {
      // Send unfollow request
      const response = await axios.post(`/api/users/userunfollow`, 
        { userId: UserIdtoFollow },
        { headers: { 'Authorization': `Bearer ${accessToken}` }}
      );
      
      console.log('Unfollow response:', response.data);
      
      if (response.data.success) {
        setStatus('not_following');
      }
    } catch (err) {
      setStatus('error');
      setError('Failed to unfollow user');
      console.error('Error unfollowing user:', err);
    }
  };

  const handleAcceptRequest = async () => {
    if (!accessToken) return;
    
    setStatus('loading');
    setError('');

    try {
      // Accept follow request
      const response = await axios.post(`/api/users/followreq/accept`, 
        { userId: UserIdtoFollow, status: 'accepted' },
        { headers: { 'Authorization': `Bearer ${accessToken}` }}
      );
      
      console.log('Accept follow response:', response.data);
      
      if (response.data.success) {
        setStatus('following');
        // Add the user to Redux store connections
        if (username && selectedField) {
          dispatch(followUser({
            userId: UserIdtoFollow,
            username: username,
            selectedField: selectedField
          }));
        }
      }
    } catch (err) {
      setStatus('error');
      setError('Failed to accept follow request');
      console.error('Error accepting follow request:', err);
    }
  };

  const handleRejectRequest = async () => {
    if (!accessToken) return;
    
    setStatus('loading');
    setError('');

    try {
      // Reject follow request
      const response = await axios.post(`/api/users/followreq/accept`, 
        { userId: UserIdtoFollow, status: 'rejected' },
        { headers: { 'Authorization': `Bearer ${accessToken}` }}
      );
      
      console.log('Reject follow response:', response.data);
      
      if (response.data.success) {
        setStatus('not_following');
      }
    } catch (err) {
      setStatus('error');
      setError('Failed to reject follow request');
      console.error('Error rejecting follow request:', err);
    }
  };

  const getButtonText = () => {
    switch(status) {
      case 'not_following': return 'Follow';
      case 'pending': return 'Requested';
      case 'following': return 'Following';
      case 'loading': return '...';
      case 'error': return 'Retry';
      case 'incoming_request': return 'Respond';
    }
  };

  const getButtonStyle = () => {
    const baseStyle = 'w-full py-2 text-white font-semibold text-sm rounded-md transition-colors';
    
    switch(status) {
      case 'not_following': 
        return `${baseStyle} hover:bg-blue-700`;
      case 'pending':
        return `${baseStyle} opacity-80 cursor-default`;
      case 'following':
        return `${baseStyle} bg-gray-700 hover:bg-red-600 hover:opacity-90`;
      case 'loading':
        return `${baseStyle} opacity-60 cursor-wait`;
      case 'error':
        return `${baseStyle} bg-red-600 hover:bg-red-700`;
      case 'incoming_request':
        return `${baseStyle} bg-purple-600 hover:bg-purple-700`;
    }
  };

  const handleClick = () => {
    if (status === 'following') {
      handleUnfollow();
    } else if (status === 'not_following' || status === 'error') {
      handleFollow();
    }
    // Do nothing for 'pending' or 'loading' states
  };

  if (status === 'incoming_request') {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-sm text-purple-300 mb-1">Follow Request Received</div>
        <div className="flex gap-2">
          <button
            onClick={handleAcceptRequest}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-md transition-colors"
          >
            Accept
          </button>
          <button
            onClick={handleRejectRequest}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold text-sm rounded-md transition-colors"
          >
            Decline
          </button>
        </div>
        {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-700 rounded-lg p-1 shadow-md hover:shadow-lg transition-all duration-300">
      <button
        onClick={handleClick}
        className={getButtonStyle()}
        disabled={status === 'loading' || status === 'pending'}
      >
        {getButtonText()}
      </button>
      {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}
    </div>
  );
};

export default FollowButton;

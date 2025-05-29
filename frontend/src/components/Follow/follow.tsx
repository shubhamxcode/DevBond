import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

interface FollowButtonProps {
  UserIdtoFollow: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ UserIdtoFollow }) => {
  console.log(`userIdToFollow:`,UserIdtoFollow)
  const currentUserId = useSelector((state: RootState) => state.userProfile.userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleFollow = async () => {
    if (!currentUserId) {
      setError('You need to be logged in to follow users.');
      return;
    }
    setLoading(true);
    setError('');
    setPending(true);

    try {
      const response = await axios.post(`/api/users/followreq`, { UserIdtoFollow: UserIdtoFollow, currentUserId });
      console.log('Follow request sent successfully:', response.data);
      setRequested(true);
    } catch (err) {
      setError('Failed to send follow request. Please try again.');
      console.error('Error sending follow request:', err);
    } finally {
      setLoading(false);
      setPending(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-700 rounded-lg p-1 shadow-md hover:shadow-lg transition-all duration-300">
      <button
        onClick={handleFollow}
        className={`w-full px-56 py-2 text-white font-semibold text-sm rounded-md hover:bg-blue-700 transition-colors ${
          loading || pending || requested ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading || pending || requested}
      >
        {requested
          ? 'Requested'
          : pending
          ? 'Pending...'
          : loading
          ? 'Following...'
          : 'Follow'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FollowButton;
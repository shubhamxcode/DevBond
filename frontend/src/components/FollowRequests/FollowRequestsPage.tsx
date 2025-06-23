import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import FollowRequests from './FollowRequests';

const FollowRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);
  
  // Check authentication
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  if (!accessToken) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="bg-gray-900 min-h-screen pt-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-8">Follow Requests</h1>
          <FollowRequests />
        </div>
      </div>
    </div>
  );
};

export default FollowRequestsPage; 
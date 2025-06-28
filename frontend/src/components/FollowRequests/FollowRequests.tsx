import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

interface FollowRequest {
  _id: string;
  from: {
    _id: string;
    username: string;
    selectedField?: string;
  };
  status: string;
  createdAt: string;
}

const FollowRequests: React.FC = () => {
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<{id: string, action: 'accept' | 'reject'} | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);

  const apiUrl=import.meta.env.DEV ? "http://localhost:4001":import.meta.env.VITE_RENDER_URL_ 

  useEffect(() => {
    const fetchRequests = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/users/followreq/pending`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (response.data.success) {
          setRequests(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching follow requests:', err);
        setError('Failed to load follow requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [accessToken]);

  const confirmAction = (requestId: string, action: 'accept' | 'reject') => {
    setShowConfirm({id: requestId, action});
  };

  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    if (!accessToken) return;
    
    setProcessingId(requestId);
    setShowConfirm(null);
    setError('');

    try {
      const response = await axios.post(`${apiUrl}/api/users/followreq/accept`, 
        { 
          userId: requestId, 
          status: action === 'accept' ? 'accepted' : 'rejected' 
        }, 
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      if (response.data.success) {
        // Remove the request from the list
        setRequests(prev => prev.filter(req => req.from._id !== requestId));
        
        // Show success message
        setSuccessMessage(
          action === 'accept' 
            ? 'Follow request accepted! You can now connect with this user.' 
            : 'Follow request declined.'
        );
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error(`Error ${action}ing follow request:`, err);
      setError(`Failed to ${action} follow request`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-400 rounded-lg p-4 text-red-300">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 text-sm bg-red-500/30 hover:bg-red-500/40 rounded-md text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-indigo-500/20 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No pending follow requests</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          When someone requests to follow you, they'll appear here for you to accept or decline.
        </p>
      </div>
    );
  }

  return (
    <div>
      {successMessage && (
        <div className="mb-4 p-3 bg-green-600/20 border border-green-600/30 rounded-lg text-green-400 text-sm">
          {successMessage}
        </div>
      )}
      
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request._id} className="bg-gray-700/60 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {request.from.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{request.from.username}</p>
                {request.from.selectedField && (
                  <p className="text-gray-400 text-sm">{request.from.selectedField}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2 w-full sm:w-auto">
              {showConfirm && showConfirm.id === request.from._id ? (
                <div className="bg-gray-800/80 p-2 rounded-lg text-sm flex flex-col space-y-2 w-full sm:w-auto">
                  <p className="text-white text-center">
                    {showConfirm.action === 'accept' 
                      ? 'Accept this follow request?' 
                      : 'Decline this follow request?'}
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleRequestAction(request.from._id, showConfirm.action)}
                      className={`px-3 py-1 ${showConfirm.action === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white text-sm font-medium rounded-md`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowConfirm(null)}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-md"
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => confirmAction(request.from._id, 'accept')}
                    disabled={processingId === request.from._id}
                    className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md ${processingId === request.from._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => confirmAction(request.from._id, 'reject')}
                    disabled={processingId === request.from._id}
                    className={`px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-md ${processingId === request.from._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowRequests; 
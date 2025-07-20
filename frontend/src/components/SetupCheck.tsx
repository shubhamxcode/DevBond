import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const SetupCheck: React.FC = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);

  const apiUrl = import.meta.env.DEV ? "http://localhost:4001" : import.meta.env.VITE_RENDER_URL_;

  useEffect(() => {
    const checkUserSetup = async () => {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/api/users/check-setup`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        const { hasResume, hasSelectedField, isSetupComplete } = response.data.data;

        if (isSetupComplete) {
          // User has both resume and field selected, redirect to profile
          navigate('/profile');
        } else if (hasResume && !hasSelectedField) {
          // User has resume but no field selected, redirect to field selection
          navigate('/field');
        } else if (!hasResume) {
          // User has no resume, redirect to resume parsing
          navigate('/Resumeparsing');
        } else {
          // Fallback to resume parsing
          navigate('/Resumeparsing');
        }
      } catch (error: any) {
        console.error('Error checking user setup:', error);
        setError('Failed to check user setup status');
        // Fallback to resume parsing
        navigate('/Resumeparsing');
      } finally {
        setIsChecking(false);
      }
    };

    checkUserSetup();
  }, [accessToken, navigate, apiUrl]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">Checking your setup...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/Resumeparsing')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Continue to Resume Upload
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SetupCheck; 
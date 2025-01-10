import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
// import Field from '../devfields/field';
import Signinform from '../../siginform'

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();  // Initialize navigate

  // Initialize Firebase Auth
  const auth = getAuth();

  // Use Effect to detect authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // If user is authenticated, navigate to the desired route
        navigate('/field');  // Replace '/dashboard' with your target route
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <div className='bg-gray-900 text-white min-h-screen flex justify-center items-center flex-col'>
  <h1 className='text-green-400 text-6xl mb-8'>Start your journey from here</h1>
  <div className="max-w-7xl w-full px-4">
    {user ? (
      <div>
        {/* Additional content for logged-in user */}
      </div>
    ) : (
      <div>
        <Signinform/>
      </div>
    )}
  </div>
</div>

  
  );
};

export default App;

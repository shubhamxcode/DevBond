import { useState, useEffect } from 'react';
import { signInWithGitHub, signInWithGoogle} from '../../authfunction/auth';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
// import Field from '../devfields/field';

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

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <div className='gap-y-4' style={{ backgroundColor: '#121212', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1 className=' text-green-400 text-3xl'>Start your journey from here</h1>
      {user ? (
        <div className=''>
          
        </div>
      ) : (
        <div className='space-x-3'>
          <button onClick={signInWithGoogle} style={{ padding: '10px 20px', backgroundColor: '#4285F4', color: '#fff', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>
            Sign In with Google
          </button>
          <button onClick={signInWithGitHub} style={{ padding: '10px 20px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>
            Sign In with GitHub
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

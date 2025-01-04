import React, { useState, useEffect } from 'react';
import { signInWithGitHub, signInWithGoogle, logout } from '../../authfunction/auth';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Initialize Firebase Auth
  const auth = getAuth();

  // Use Effect to detect authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <div style={{ backgroundColor: '#121212', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1 className='text-2xl'>Start your journey frome here</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName || 'User'}</p>
          <button onClick={logout} style={{ padding: '10px 20px', backgroundColor: '#6200ea', color: '#fff', border: 'none', borderRadius: '5px' }}>Sign Out</button>
        </div>
      ) : (
        <div>
          <button onClick={signInWithGoogle} style={{ padding: '10px 20px', backgroundColor: '#4285F4', color: '#fff', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>Sign In with Google</button>
          <button onClick={signInWithGitHub} style={{ padding: '10px 20px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>Sign In with GitHub</button>
        </div>
      )}
    </div>
  );
};

export default App;

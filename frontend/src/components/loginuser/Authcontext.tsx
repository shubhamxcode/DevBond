import React, { createContext, useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initial login state

  const login = (token: string) => {
    setIsLoggedIn(true);
    // Store token in secure storage here
    localStorage.setItem('token', token); 
  };

  const value: AuthContextType = { isLoggedIn, login };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
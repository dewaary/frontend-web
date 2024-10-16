// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  name: string;
  email: string;
  image: string; // Add image field here
  setUser: (user: { name: string; email: string; image: string }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; email: string; image: string }>({
    name: '',
    email: '',
    image: '' // Initialize image state
  });

  const setUserDetails = (user: { name: string; email: string; image: string }) => {
    setUser(user);
  };

  return (
    <UserContext.Provider value={{ ...user, setUser: setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const storedAccount = localStorage.getItem('userAccount');
    
    if (stored) {
      const userData = JSON.parse(stored);
      setCurrentUser(userData);
      
      if (storedAccount) {
        setUserAccount(JSON.parse(storedAccount));
      }
    }
    setLoadingUser(false);
  }, []);

  const login = (userData, accountData) => {
    setCurrentUser(userData);
    setUserAccount(accountData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (accountData) {
      localStorage.setItem('userAccount', JSON.stringify(accountData));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserAccount(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userAccount');
  };

  const updateUserAccount = (accountData) => {
    setUserAccount(accountData);
    localStorage.setItem('userAccount', JSON.stringify(accountData));
  };

  const value = {
    currentUser,
    userAccount,
    loadingUser,
    login,
    logout,
    updateUserAccount
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 
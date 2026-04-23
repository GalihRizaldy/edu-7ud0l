import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth_id') === 'true';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('auth_role');
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('auth_username');
  });
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('auth_balance');
    return saved ? parseInt(saved) : 50000;
  });
  const [spinCount, setSpinCount] = useState(0);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('auth_history');
    return saved ? JSON.parse(saved) : [50000];
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('auth_id', isAuthenticated);
    localStorage.setItem('auth_role', role || '');
    localStorage.setItem('auth_username', username || '');
    localStorage.setItem('auth_balance', balance);
    localStorage.setItem('auth_history', JSON.stringify(history));
  }, [isAuthenticated, role, username, balance, history]);

  // Set authentication after successful backend verification
  const setAuthData = (assignedRole, assignedUsername) => {
    setIsAuthenticated(true);
    setRole(assignedRole);
    setUsername(assignedUsername);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUsername(null);
    localStorage.clear();
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      role,
      username,
      setAuthData,
      logout,
      balance, setBalance,
      spinCount, setSpinCount,
      history, setHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};

import React, { createContext, useState, useContext, useEffect } from 'react';
import { users, hasPermission } from '../config/users';

const AuthContext = createContext();

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => loadFromLocalStorage('currentUser', null));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!loadFromLocalStorage('isAuthenticated', false));
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }, [currentUser, isAuthenticated]);

  const login = (email) => {
    const user = users[email];
    if (user) {
      const userWithEmail = { ...user, email };
      setCurrentUser(userWithEmail);
      setIsAuthenticated(true);
      setAuthError(null);
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
      return true;
    } else {
      setAuthError('User not found or unauthorized');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  };

  const checkPermission = (requiredPermission) => {
    if (!currentUser) return false;
    return hasPermission(currentUser.role, requiredPermission);
  };

  const value = {
    currentUser,
    isAuthenticated,
    authError,
    login,
    logout,
    checkPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protecting routes
export const withAuth = (WrappedComponent, requiredPermission = 'read') => {
  return function WithAuthComponent(props) {
    const { isAuthenticated, checkPermission } = useAuth();

    if (!isAuthenticated) {
      return null; // or redirect to login
    }

    if (!checkPermission(requiredPermission)) {
      return <div>Access Denied: Insufficient permissions</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * FIXED API_URL LOGIC
 * This ensures that the URL always starts with https:// if it's not localhost.
 * This prevents the browser from treating your Railway link as a local folder.
 */
const getBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL;
  
  // 1. If no variable is found or we are on localhost, use local backend
  if (!rawUrl || rawUrl.includes('localhost')) {
    return 'http://localhost:5000/api';
  }

  // 2. Clean the URL: Remove existing protocol and re-add https:// strictly
  const cleanUrl = rawUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `https://${cleanUrl}/api`;
};

const API_URL = getBaseUrl();

// Debugging log - this will show up in your F12 console
console.log("🚀 TypeShift API is pointing to:", API_URL);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testHistory, setTestHistory] = useState([]);

  const fetchHistory = async (token) => {
    try {
      const response = await fetch(`${API_URL}/tests/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const history = await response.json();
        const formattedHistory = history.map(test => ({
          id: test.id,
          wpm: test.wpm,
          rawWpm: test.rawWpm,
          accuracy: test.accuracy,
          mode: test.durationMode,
          date: test.timestamp
        }));
        setTestHistory(formattedHistory);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            await fetchHistory(token);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        await fetchHistory(data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Network error. Could not connect to server." };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setTestHistory([]);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Network error. Could not connect to server." };
    }
  };

  const logout = () => {
    setUser(null);
    setTestHistory([]);
    localStorage.removeItem('token');
  };

  const addTestResult = async (result) => {
    if (!user) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(result)
      });

      if (response.ok) {
        const newResult = await response.json();
        const formattedResult = {
          id: newResult.id,
          wpm: newResult.wpm,
          rawWpm: newResult.rawWpm,
          accuracy: newResult.accuracy,
          mode: newResult.durationMode,
          date: newResult.timestamp
        };
        setTestHistory(prev => [formattedResult, ...prev]);
      }
    } catch (error) {
      console.error('Failed to save test result:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, testHistory, addTestResult }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
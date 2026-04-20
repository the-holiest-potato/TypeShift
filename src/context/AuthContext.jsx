import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

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
        // Transform backend response to match frontend expectations if needed
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
  };

  const register = async (username, email, password) => {
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

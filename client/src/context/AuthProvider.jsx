import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { TOKEN_KEY } from '../api/client';
import { loginUser, registerUser, getCurrentUser } from '../api/authApi';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    getCurrentUser()
      .then((data) => setUser(data.user))
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          return;
        }
        console.error('Unable to restore the saved session:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ user: sessionUser, token }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(sessionUser);
  };

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    saveSession(data);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    saveSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isLoggedIn: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

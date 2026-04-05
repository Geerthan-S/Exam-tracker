import { useState, useEffect } from 'react';
import StudyTracker from './StudyTracker';
import AuthScreen from './AuthScreen';

const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:3001/api';
function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('auth_username'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
      if (username) localStorage.setItem('auth_username', username);
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_username');
    }
  }, [token, username]);

  const handleLogin = async (usr: string, pass: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usr, password: pass })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    setToken(data.token);
    setUsername(data.username);
  };

  const handleRegister = async (usr: string, pass: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usr, password: pass })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    setToken(data.token);
    setUsername(data.username);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
  };

  if (!token) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return <StudyTracker token={token} username={username} onLogout={handleLogout} apiUrl={API_URL} />;
}

export default App;

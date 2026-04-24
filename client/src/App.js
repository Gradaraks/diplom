import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Editor from './pages/Editor';
import Scripts from './pages/Scripts';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auth/me')
      .then(res => setUser(res.data.email))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
  };

  if (loading) return <div style={{ padding: 20 }}>Загрузка...</div>;

  return (
    <BrowserRouter>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <div style={{ padding: 20 }}>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login onLogin={setUser} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Editor />} />
              <Route path="/scripts" element={<Scripts />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
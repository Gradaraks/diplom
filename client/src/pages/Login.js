import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const { data } = await axios.post(url, { email, password });
      if (!isRegister) onLogin(data.email);
      else {
        // после регистрации сразу логинимся
        await axios.post('/api/auth/login', { email, password });
        onLogin(email);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка сети');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2>{isRegister ? 'Регистрация' : 'Вход'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, margin: '5px 0' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: 8, margin: '5px 0' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', marginTop: 10 }}>
          {isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
      <p style={{ marginTop: 15, textAlign: 'center' }}>
        <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'transparent', color: '#61dafb', border: 'none', cursor: 'pointer' }}>
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </p>
    </div>
  );
};

export default Login;
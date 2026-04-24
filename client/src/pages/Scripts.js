import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Scripts = () => {
  const [scripts, setScripts] = useState([]);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('python');
  const [error, setError] = useState('');

  const fetchScripts = async () => {
    try {
      const { data } = await axios.get('/api/scripts');
      setScripts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchScripts(); }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await axios.post('/api/scripts', { name, language, code: '' });
      setName('');
      fetchScripts();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить скрипт?')) return;
    try {
      await axios.delete(`/api/scripts/${id}`);
      fetchScripts();
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  return (
    <div>
      <h2>Мои скрипты</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Название скрипта"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="sql">SQL</option>
        </select>
        <button onClick={handleSave} style={{ marginLeft: 10 }}>Создать</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {scripts.map(s => (
          <li key={s.id} style={{ marginBottom: 8 }}>
            <strong>{s.name}</strong> ({s.language}) – {new Date(s.updated_at).toLocaleString()}
            <button onClick={() => handleDelete(s.id)} style={{ marginLeft: 10 }}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scripts;
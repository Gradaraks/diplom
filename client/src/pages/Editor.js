import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import OutputPanel from '../components/OutputPanel';

const LANGUAGES = ['python', 'cpp', 'javascript', 'sql'];
const DEFAULT_CODES = {
  python: 'print("Hello, world!")',
  cpp: '#include <iostream>\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}',
  javascript: 'console.log("Hello, world!");',
  sql: 'SELECT 1;',
};

const MonacoEditorPage = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODES.python);
  const [stdin, setStdin] = useState('');
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setStdout('');
    setStderr('');
    try {
      const { data } = await axios.post('/api/execute', { language, code, stdin });
      setStdout(data.stdout);
      setStderr(data.stderr);
    } catch (err) {
      setStderr(err.response?.data?.error || 'Ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '80vh' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 10 }}>
          <select value={language} onChange={e => { setLanguage(e.target.value); setCode(DEFAULT_CODES[e.target.value]); }}>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language === 'javascript' ? 'javascript' : language === 'sql' ? 'sql' : 'python'}
            value={code}
            onChange={val => setCode(val || '')}
            theme="vs-dark"
            options={{ fontSize: 14, wordWrap: 'on' }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <textarea
            rows={3}
            placeholder="Входные данные (stdin)"
            value={stdin}
            onChange={e => setStdin(e.target.value)}
          />
        </div>
        <button onClick={handleRun} disabled={loading} style={{ marginTop: 10 }}>
          {loading ? 'Выполняется...' : 'Запустить'}
        </button>
      </div>
      <div style={{ flex: 0.5, marginLeft: 20 }}>
        <OutputPanel stdout={stdout} stderr={stderr} />
      </div>
    </div>
  );
};

export default MonacoEditorPage;
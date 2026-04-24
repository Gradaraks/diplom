import React from 'react';

const OutputPanel = ({ stdout, stderr }) => (
  <div style={{ height: '100%' }}>
    <h3>Стандартный вывод</h3>
    <pre>{stdout || '(пусто)'}</pre>
    <h3 style={{ color: '#f44747' }}>Ошибки</h3>
    <pre style={{ color: '#f44747' }}>{stderr || '(пусто)'}</pre>
  </div>
);

export default OutputPanel;
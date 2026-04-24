import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => (
  <nav>
    <div>
      <Link to="/">Редактор</Link>
      <Link to="/scripts">Мои скрипты</Link>
    </div>
    <div>
      <span style={{ marginRight: 15 }}>{user}</span>
      <button onClick={onLogout}>Выйти</button>
    </div>
  </nav>
);

export default Navbar;
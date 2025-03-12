import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/">My Blog</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">Register</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/posts">Posts</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

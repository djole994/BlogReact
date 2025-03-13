import React, { useState } from 'react';
import api from '../../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { username, email, password });
      setMessage(response.data.message || 'Registration successful!');
    } catch (error) {
      setMessage(error.response?.data || 'Registration error');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 className="mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="container my-4" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </form>
    </div>
  );
};

export default Register;

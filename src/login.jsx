import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FormStyles.css';

const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login Data:', loginData);

    try {
        const response = await axios.post('http://localhost:1234/api/login', loginData);

        if (response.status === 200) {
            console.log('Login Successful:', response.data);
            setError('');

            // Store user information in sessionStorage
            sessionStorage.setItem('userRole', response.data.userRole);
            sessionStorage.setItem('distributorId', response.data.distributorId);
            sessionStorage.setItem('distributorName', response.data.distributorName);

            // Redirect based on user role
            if (response.data.userRole === 'central-admin') {
                navigate('/central-admin-orders');
            } else if (response.data.userRole === 'distributor') {
                navigate('/create-order');
            }
        }
    } catch (error) {
        console.error('Login Error:', error);
        setError(error.response?.data?.error || 'An error occurred during login');
    }
};

  return (
    <div>
      <nav className="navbar">
        <h1>INT</h1>
      </nav>

      <div className="form-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email ID:</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

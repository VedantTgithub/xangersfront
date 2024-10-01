import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FormStyles.css';

const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Data Submitted:', loginData);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1>INT</h1>
      </nav>

      {/* Form Container */}
      
        <div className="form-card">
          <h2>Login</h2>
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

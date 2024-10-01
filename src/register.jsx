import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FormStyles.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    distributorName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here
    console.log('Form Data Submitted:', formData);
  };

  return (

    <div>
        <nav className="navbar">
        <h1>INT</h1>
      </nav>
      <div className="form-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email ID:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Distributor Name:</label>
            <input
              type="text"
              name="distributorName"
              value={formData.distributorName}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
     </div> 
    
  );
};

export default RegistrationForm;

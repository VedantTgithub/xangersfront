import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './FormStyles.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    distributorName: '',
    country: '',
  });

  const [error, setError] = useState(''); // State for error messages
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:1234/api/register', formData); // Update with your API URL
      console.log('Form Data Submitted:', response.data);
      setSuccessMessage('Registration successful!'); // Set success message
      setError(''); // Clear error message
      setFormData({
        email: '',
        password: '',
        distributorName: '',
        country: '',
      }); // Clear form data
    } catch (error) {
      console.error('Error during registration:', error.response.data);
      setError(error.response?.data?.error || 'Registration failed. Please try again.'); // Set error message
      setSuccessMessage(''); // Clear success message
    }
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'India', 
    'Germany', 'France', 'Brazil', 'China', 'Japan', 'South Africa',
    'Italy', 'Mexico', 'Russia', 'Spain', 'Netherlands', 'Sweden', 'Norway',
    'Switzerland', 'New Zealand', 'Sri Lanka', 'UAE'
  ];

  return (
    <div>
      <nav className="navbar">
        <h1>INT</h1>
      </nav>
      <div className="form-card">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>} {/* Display error message */}
        {successMessage && <div className="success-message">{successMessage}</div>} {/* Display success message */}
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
          <div className="form-field">
            <label>Country:</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select your country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
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

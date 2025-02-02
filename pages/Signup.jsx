import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/; // No spaces or special characters
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // At least 6 characters, letters and numbers
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'username' && !validateUsername(value)) {
      setError({ ...error, username: 'Username must be a single word with no spaces or special characters' });
    } else if (name === 'username') {
      setError({ ...error, username: '' });
    }

    if (name === 'email' && !validateEmail(value)) {
      setError({ ...error, email: 'Invalid email format' });
    } else if (name === 'email') {
      setError({ ...error, email: '' });
    }

    if (name === 'password' && !validatePassword(value)) {
      setError({ ...error, password: 'Password must be at least 6 characters and include letters and numbers' });
    } else if (name === 'password') {
      setError({ ...error, password: '' });
    }

    if (name === 'confirmPassword' && value !== formData.password) {
      setError({ ...error, confirmPassword: 'Passwords do not match' });
    } else if (name === 'confirmPassword') {
      setError({ ...error, confirmPassword: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError({ ...error, confirmPassword: 'Passwords do not match' });
      return;
    }

    if (error.username || error.email || error.password || error.confirmPassword) {
      return; // Prevent submission if there are errors
    }

    try {
      const hashedPassword = CryptoJS.SHA256(formData.password).toString();

      const userData = {
        username: formData.username,
        email: formData.email,
        password: hashedPassword,
      };

      await axios.post('http://localhost:8080/signup', userData);
      setSuccessMessage('Signup successful! Please log in.');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setError({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError({ ...error, general: 'Signup failed. Please try again.' });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg md:max-w-2xl">
        <h2 className="text-4xl font-semibold mb-6 text-left text-black">Signup</h2>

        {error.general && <p className="text-red-500 text-center mb-4">{error.general}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
            {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
            {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
            {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
            {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black">
          Already have an account?{' '}
          <a href="/login" className="font-bold text-blue-700 hover:text-gray-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

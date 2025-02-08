import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState({
    email: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email' && !validateEmail(value)) {
      setError({ ...error, email: 'Invalid email format' });
    } else if (name === 'email') {
      setError({ ...error, email: '' });
    }

    if (name === 'password' && !validatePassword(value)) {
      setError({ ...error, password: 'Password must be at least 6 characters' });
    } else if (name === 'password') {
      setError({ ...error, password: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error.email || error.password) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/login', formData);
      setSuccessMessage('Login successful! Redirecting...');
      
      // Clear form after successful login
      setFormData({
        email: '',
        password: '',
      });
      setError({
        email: '',
        password: '',
      });

      // Store JWT Token (Assuming API returns it)
      localStorage.setItem('token', response.data.token);

      // Redirect Logic (Replace with your navigation)
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      setError({ ...error, general: 'Invalid credentials. Please try again.' });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg md:max-w-2xl">
        <h2 className="text-4xl font-semibold mb-6 text-left text-black">Login</h2>

        {error.general && <p className="text-red-500 text-center mb-4">{error.general}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black">
          Don't have an account?{' '}
          <a href="/signup" className="font-bold text-blue-700 hover:text-gray-600">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

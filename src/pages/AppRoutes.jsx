import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import Login from './Login';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route default path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
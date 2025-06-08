
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to login page since we have a proper login system
  return <Navigate to="/login" replace />;
};

export default Index;

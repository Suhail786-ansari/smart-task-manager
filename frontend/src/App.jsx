import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';       
import KanbanBoard from './components/KanbanBoard';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Public Route: Login page */}
        <Route 
          path="/" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Register route ko temporary Login par redirect kiya taaki koi import error na aaye */}
        <Route 
          path="/register" 
          element={<Navigate to="/" />} 
        />

        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <KanbanBoard /> : <Navigate to="/" />} 
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
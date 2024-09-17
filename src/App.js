import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import FileUploadPage from './FileUploadPage';
import { useMsal } from '@azure/msal-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const { accounts } = useMsal(); // MSAL hook to get the current logged-in account

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    } else if (accounts.length > 0) {
      // If user is already signed in
      setIsAuthenticated(true);
      setUserId(accounts[0].homeAccountId);
      localStorage.setItem('user_id', accounts[0].homeAccountId);
    }
  }, [accounts]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserId={setUserId} />}
        />
        <Route
          path="/upload"
          element={
            isAuthenticated ? <FileUploadPage userId={userId} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/upload" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

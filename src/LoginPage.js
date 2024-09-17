import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './msalConfig';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setIsAuthenticated, setUserId }) {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Initiate the login popup
      const loginResponse = await instance.loginPopup(loginRequest);

      // Handle the authentication response
      const user = loginResponse.account;
      setIsAuthenticated(true);
      setUserId(user.homeAccountId);
      localStorage.setItem('user_id', user.homeAccountId);

      // Redirect to upload page after successful login
      navigate('/upload');
    } catch (error) {
      console.error('Login failed: ', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login with Microsoft</h2>
      <button onClick={handleLogin}>Sign in with Microsoft</button>
    </div>
  );
}

export default LoginPage;

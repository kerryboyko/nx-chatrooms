import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton: React.FC<unknown> = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const handleClick = () => loginWithRedirect();
  return (
    <>
      <pre>{JSON.stringify({ isAuthenticated, user }, null, 2)}</pre>
      <button onClick={handleClick}>Login</button>
    </>
  );
};

export default LoginButton;

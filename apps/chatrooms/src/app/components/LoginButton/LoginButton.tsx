import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton: React.FC<unknown> = () => {
  const { loginWithRedirect } = useAuth0();
  const handleClick = () => loginWithRedirect();
  return <button onClick={handleClick}>Login</button>;
};

export default LoginButton;

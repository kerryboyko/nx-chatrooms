import React, { useEffect, useState } from 'react';
import { Message } from '@chatrooms/api-interfaces';
import sharedEnvironment from '@chatrooms/environments';

export const App: React.FC<unknown> = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to chatrooms!</h1>
        <pre>{JSON.stringify({ sharedEnvironment }, null, 2)}</pre>
        <img
          width="450"
          src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png"
          alt="Nx Logo"
        />
        <pre>{JSON.stringify(process.env)}</pre>
      </div>
      <div>{m.message}</div>
    </>
  );
};

export default App;

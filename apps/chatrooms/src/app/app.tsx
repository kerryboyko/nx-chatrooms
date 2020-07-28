import React, { useEffect, useState } from 'react';
import { Message } from '@chatrooms/api-interfaces';
import sharedEnvironment from '@chatrooms/environments';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import LoginButton from './components/LoginButton';

export const App: React.FC<unknown> = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <Auth0Provider
      domain="freetyme.auth0.com"
      clientId="5mxCOdFEnHQ5FmlwLinMt5vUOfSc5VNX"
      redirectUri={`${window.location.origin}/authorise`}
    >
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to chatrooms!</h1>
        <pre>{JSON.stringify({ sharedEnvironment }, null, 2)}</pre>
        <img
          width="450"
          src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png"
          alt="Nx Logo"
        />
        <pre>{JSON.stringify(process.env)}</pre>
        <LoginButton />
      </div>
      <div>{m.message}</div>
      <Router>
        <Switch>
          <Route path="/authorise">
            <h2>Authorise</h2>
          </Route>
          <Route path="/logout">
            <h2>logout</h2>
          </Route>
          <Route path="/logout">
            <h2>home</h2>
          </Route>
        </Switch>
      </Router>
    </Auth0Provider>
  );
};

export default App;

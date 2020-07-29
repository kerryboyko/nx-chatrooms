import React, { useEffect, useState } from 'react';
import { Message } from '@chatrooms/api-interfaces';
import sharedEnvironment from '@chatrooms/environments';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ChatRoom from './containers/ChatRoom';

import LoginButton from './components/LoginButton';

export const App: React.FC<unknown> = () => {
  const [m, setMessage] = useState<Message>({ message: '' });
  const { user, isAuthenticated } = useAuth0();
  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <>
      <div>
        <ChatRoom />
        <LoginButton />
      </div>
      <h3>
        Is authenticated?: {isAuthenticated} | Email? {user && user.email}
      </h3>
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
    </>
  );
};

export default App;

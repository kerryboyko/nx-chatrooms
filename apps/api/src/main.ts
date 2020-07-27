import express from 'express';
import WS from 'ws';
import { Message } from '@chatrooms/api-interfaces';
import sharedEnvironment from '@chatrooms/environments';
import loadGraphql from './app/graphql/loadGraphql';
import onConnection from './app/websockets/onConnection';
import type { Application, Response } from 'express';
import type { Server } from 'http';

const app: Application = express();

const greeting: Message = { message: 'Welcome to api!' };

app.get('/api', (_req, res: Response) => {
  res.send(greeting);
});

loadGraphql(app);

const PORT = sharedEnvironment.SERVER_PORT;

const server: Server = app.listen(PORT, () => {
  console.log('Listening at http://localhost:' + PORT + '/api');
});
const wss: WS.Server = new WS.Server({ server });
onConnection(wss);

server.on('error', console.error);

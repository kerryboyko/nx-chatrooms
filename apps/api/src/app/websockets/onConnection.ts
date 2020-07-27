import WS from 'ws';

const onConnection = (wss: WS.Server): void => {
  wss.on('connection', (ws: WS) => {
    ws.on('message', (message: string) => {
      console.log(`Recieved ${message}`);
      ws.send(`Hello! You sent ${message}`);
    });
    ws.send('Hello! I am a websocket server!');
  });
};

export default onConnection;

const sharedEnvironment = {
  SERVER_PORT: 3333,
  MONGO_URL: `mongodb://localhost:27017`,
  MONGO_PORT: 27017,
  MONGO_DB_NAME: 'chatrooms',
  AUTH0_DOMAIN: process.env.REACT_APP_AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  AUTH0_SECRET: process.env.REACT_APP_AUTH0_SECRET,
};

export default sharedEnvironment;

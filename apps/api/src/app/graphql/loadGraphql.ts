import { graphqlHTTP } from 'express-graphql';
import { buildSchema, GraphQLSchema } from 'graphql';
import type { Application } from 'express';

const schema: GraphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: (): string => 'Hello World!',
};

const loadGraphql = (app: Application): Application => {
  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    })
  );
  return app;
};

export default loadGraphql;

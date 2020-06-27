import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './lib/resolvers';
import { typeDefs } from './lib/typeDefs';
import logger from './lib/logger';

const port = process.env.PORT || 9000;

const mount = (app: Application) => {
  app.use(express.static(`${__dirname}/client`));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  server.applyMiddleware({ app, path: '/api' });
  app.listen(port, () => logger.info(`Server is running on port ${port}`));

  app.get('/', (_req, res) => {
    const options = {
      root: `${__dirname}/client/`,
    };
    res.sendFile(`index.html`, options, (err) => {
      if (err) {
     logger.info(err.message)
      }
    });
  });
};

mount(express());

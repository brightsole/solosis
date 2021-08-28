import { ApolloServer } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import DataBase from '@brightsole/sleep-talk';
import { getResolvers } from '../src/resolvers';
import getTypeDefs from '../src/schema';

jest.mock('@brightsole/sleep-talk');

export default (context = {}) => {
  const thingSource = new DataBase({} as any);

  const server = new ApolloServer({
    schema: buildFederatedSchema([
      {
        typeDefs: getTypeDefs(),
        resolvers: getResolvers(),
      } as any,
    ]),
    typeDefs: getTypeDefs(),
    resolvers: getResolvers() as any,
    dataSources: () => ({ thingSource }),
    context,
  });

  return { server, thingSource, context };
};

import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { rule, shield } from 'graphql-shield';
import { Query } from '@brightsole/sleep-talk';
import { Thing, Input, IdObject, GenericThingPayload, Context } from './types';
import getEnv from './env';

// restricts the very open api to only allow queries from sources
// that know our internal secure api token
const matchesToken = () =>
  rule({ cache: 'contextual' })(
    async (_parent, _args, context) => context.token === getEnv().token
  );

export const getPermissions = () =>
  shield({
    Query: {
      '*': matchesToken(),
    },
    Mutation: {
      '*': matchesToken(),
    },
  });

export const getResolvers = () => ({
  Query: {
    thing: async (_: any, args: IdObject, { dataSources, hashKey }: Context) =>
      dataSources.thingSource.getItem(args.id, { hashKey }),
    things: async (_: any, args: { input: Query }, { dataSources }: Context) =>
      dataSources.thingSource.query(args.input),
    getAllThings: async (_: any, __: any, { dataSources, hashKey }: Context) =>
      dataSources.thingSource.getAll({ hashKey }),
  },

  Mutation: {
    createThing: (
      _: any,
      args: Input,
      { dataSources, hashKey }: Context
    ): Promise<GenericThingPayload> => dataSources.thingSource.createItem(args.input, { hashKey }),
    updateThing: (
      _: any,
      args: Input,
      { dataSources, hashKey }: Context
    ): Promise<GenericThingPayload> => dataSources.thingSource.updateItem(args.input, { hashKey }),
    deleteThing: (
      _: any,
      args: IdObject,
      { dataSources, hashKey }: Context
    ): Promise<GenericThingPayload> => dataSources.thingSource.deleteItem(args.id, { hashKey }),
  },

  Item: {
    __resolveReference: ({ id }: Partial<Thing>, { dataSources, hashKey }: Context) =>
      dataSources.thingSource.getItem(id, { hashKey }),
  },

  DateTime: GraphQLDateTime,
  JSONObject: GraphQLJSONObject,
});

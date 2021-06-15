import { getResolvers } from './resolvers';

describe('Resolvers', () => {
  const hashKey = 'threeve';
  describe('Query', () => {
    it('calls getItem on the dataSource with id', async () => {
      const id = '123';

      const dataSources = {
        itemSource: {
          getItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Query: { thing },
      } = getResolvers();

      await thing(null, { id }, { dataSources, hashKey });
      expect(dataSources.thingSource.getItem).toHaveBeenCalledWith(id, { hashKey });
    });

    it('getAllThings calls getAll with { hashKey }', async () => {
      // the expectation is that most queries will be getting all things related to a hash id
      // that hash id is the user id in this implementation
      const dataSources = {
        thingSource: {
          getAll: jest.fn(() => Promise.resolve([])),
        },
      };

      const {
        Query: { getAllThings },
      } = getResolvers();

      await getAllThings(null, {}, { dataSources, hashKey });
      expect(dataSources.thingSource.getAll).toHaveBeenCalledWith({ hashKey });
    });

    it('things calls query with { ...query }', async () => {
      const input = {
        name: { $contains: 'floop' },
      };
      // this is the slower dynamodb scan that has a more open query structure than `getAll`
      const dataSources = {
        thingSource: {
          query: jest.fn(() => Promise.resolve([])),
        },
      };

      const {
        Query: { things },
      } = getResolvers();

      await things(null, { input }, { dataSources });
      expect(dataSources.thingSource.query).toHaveBeenCalledWith(input);
    });

    it('reference resolver calls getItem on the dataSource with { id }', async () => {
      const id = '123';

      const dataSources = {
        itemSource: {
          getItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Item: { __resolveReference },
      } = getResolvers();

      await __resolveReference({ id }, { dataSources, hashKey });
      expect(dataSources.itemSource.getItem).toHaveBeenCalledWith(id, { hashKey });
    });
  });

  describe('Mutate', () => {
    it('calls createItem on the dataSource with { id, name }', async () => {
      const item = { id: '123', name: 'widget' };

      const dataSources = {
        itemSource: {
          createItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { createItem },
      } = getResolvers();

      await createItem(null, { input: item }, { dataSources, hashKey });
      expect(dataSources.itemSource.createItem).toHaveBeenCalledWith(item, { hashKey });
    });

    it('calls updateItem on the dataSource with { id, name }', async () => {
      const item = { id: '123', name: 'widget' };

      const dataSources = {
        itemSource: {
          updateItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { updateItem },
      } = getResolvers();

      await updateItem(null, { input: item }, { dataSources, hashKey });
      expect(dataSources.itemSource.updateItem).toHaveBeenCalledWith(item, { hashKey });
    });

    it('calls deleteItem on the dataSource with id', async () => {
      const id = '123';

      const dataSources = {
        itemSource: {
          deleteItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { deleteItem },
      } = getResolvers();

      await deleteItem(null, { id }, { dataSources, hashKey });
      expect(dataSources.itemSource.deleteItem).toHaveBeenCalledWith(id, { hashKey });
    });
  });
});

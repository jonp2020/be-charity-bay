const app = require('../server');
const request = require('supertest');
const connection = require('../db/connection');

beforeEach(() => {
  return connection.seed.run();
});

afterAll(() => {
  return connection.destroy();
});

describe('app', () => {
  it('returns status 404 when invalid endpoint', () => {
    return request(app)
      .get('/invalidendpoint')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('This page does not exist');
      });
  });
  describe('/api', () => {
    describe('/categories', () => {
      it('status 405 when invalid method', () => {
        const invalidMethods = ['delete', 'post', 'patch', 'put'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/categories')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
      describe('GET', () => {
        it('status 200 and object containing array of categories', () => {
          return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({ body: { categories } }) => {
              expect(Object.keys(categories[0])).toEqual(
                expect.arrayContaining(['slug', 'description'])
              );
            });
        });
      });
    });
    describe('/charities', () => {
      it('status 405 when invalid method', () => {
        const invalidMethods = ['delete', 'post', 'patch', 'put'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/charities')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
});

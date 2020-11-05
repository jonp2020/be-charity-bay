const app = require('../server');
const request = require('supertest');
const connection = require('../db/connection');

beforeEach(() => {
  return connection.seed.run();
});

afterAll(() => {
  return connection.destroy();
});

//complete testing uploading and deleting of image

describe('app', () => {
  it('status 404 when invalid endpoint', () => {
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
      describe('GET', () => {
        it('status 200 and object containing array of charities', () => {
          return request(app)
            .get('/api/charities')
            .expect(200)
            .then(({ body: { charities } }) => {
              expect(Object.keys(charities[0])).toEqual(
                expect.arrayContaining([
                  'charity_id',
                  'name',
                  'description',
                  'location',
                ])
              );
            });
        });
      });
    });
    describe('/image', () => {
      describe('POST', () => {
        // it('status 201 and object containing image', async () => {
        //   const filePath =
        //     '/Users/jonathanparrott/Desktop/Northcoders/project/be-charity-bay/db/data/test-data/Saturn_test_1.jpeg';
        //   return request(app)
        //     .post('/api/image')
        //     .attach('file', filePath)
        //     .expect(201)
        //     .then((res) => {
        //       // console.log(res.filePath);
        //     });
        // });
      });
      describe('DELETE', () => {
        // it('', () => {
        // });
      });
    });
    describe('/items', () => {
      describe('GET', () => {
        it('status 200 and object containing array of all items', () => {
          return request(app)
            .get('/api/items')
            .expect(200)
            .then(({ body: { items } }) => {
              expect(items).toHaveLength(50);
              expect(Object.keys(items[0])).toEqual(
                expect.arrayContaining([
                  'item_id',
                  'thumbnail_img_ref',
                  'fullsize_img_ref',
                  'title',
                  'price',
                  'seller_username',
                  'category',
                  'status',
                  'buyer',
                  'description',
                  'charity_id',
                  'location',
                ])
              );
            });
        });
        it('status 200 and object containing only status queried items', () => {
          const qb = { status: 'reserved' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(200)
            .then(({ body: { items } }) => {
              items.forEach((item) => {
                expect(item.status).toBe('reserved');
              });
            });
        });
        it('status 200 and object containing only buyer queried items', () => {
          const qb = { buyer: 'Juliana Parks' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(200)
            .then(({ body: { items } }) => {
              items.forEach((item) => {
                expect(item.buyer).toBe('Juliana Parks');
              });
            });
        });
        it('status 200 and object containing only category queried items', () => {
          const qb = { category: 'Clothes' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(200)
            .then(({ body: { items } }) => {
              items.forEach((item) => {
                expect(item.category).toBe('Clothes');
              });
            });
        });
        it('status 400 when status query is not valid', () => {
          const qb = { status: 'bought' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            });
        });
        it('status 404 when buyer does not exist', () => {
          const qb = { buyer: 'Forrest Gump' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('User Not Found');
            });
        });
        it('status 404 when category does not exist', () => {
          const qb = { category: 'Oranges' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Categorie Not Found');
            });
        });
      });
      describe('POST', () => {
        it('status 201 and object containing posted item', () => {
          return request(app)
            .post('/api/items')
            .send({
              thumbnail_img_ref: 'Saturn_test_2.jpg',
              fullsize_img_ref: 'earth-pic.jpg',
              title: 'Football boots - size 6',
              description:
                'Ad eiusmod non eiusmod aute nulla et laboris magna occaecat fugiat pariatur nostrud. Voluptate pariatur laboris est cillum irure eiusmod laboris commodo labore voluptate. Veniam cillum enim magna exercitation do quis qui sint irure exercitation sint ipsum. ',
              price: 5,
              category: 'Clothes',
              seller_username: 'Lois James',
              charity_id: 5,
              location: 'Bristol',
            })
            .expect(201)
            .then(({ body: { item } }) => {
              expect(Object.keys(item)).toEqual(
                expect.arrayContaining([
                  'thumbnail_img_ref',
                  'fullsize_img_ref',
                  'title',
                  'description',
                  'price',
                  'category',
                  'status',
                  'buyer',
                  'seller_username',
                  'charity_id',
                  'location',
                ])
              );
            });
        });
        it('status 400 when there are keys missing on body', () => {
          return request(app)
            .post('/api/items')
            .send({
              thumbnail_img_ref: 'Saturn_test_2.jpg',
              fullsize_img_ref: 'earth-pic.jpg',
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            });
        });
        it('status 400 when there are additional keys on body', () => {
          return request(app)
            .post('/api/items')
            .send({
              thumbnail_img_ref: 'Saturn_test_2.jpg',
              fullsize_img_ref: 'earth-pic.jpg',
              title: 'Football boots - size 6',
              description:
                'Ad eiusmod non eiusmod aute nulla et laboris magna occaecat fugiat pariatur nostrud. Voluptate pariatur laboris est cillum irure eiusmod laboris commodo labore voluptate. Veniam cillum enim magna exercitation do quis qui sint irure exercitation sint ipsum. ',
              price: 5,
              category: 'Clothes',
              seller_username: 'Lois James',
              charity_id: 5,
              location: 'Bristol',
              value: 'priceless',
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            });
        });
        it('status 400 when body values are wrong datatypes', () => {
          return request(app)
            .post('/api/items')
            .send({
              thumbnail_img_ref: 'Saturn_test_2.jpg',
              fullsize_img_ref: 'earth-pic.jpg',
              title: 'Football boots - size 6',
              description:
                'Ad eiusmod non eiusmod aute nulla et laboris magna occaecat fugiat pariatur nostrud. Voluptate pariatur laboris est cillum irure eiusmod laboris commodo labore voluptate. Veniam cillum enim magna exercitation do quis qui sint irure exercitation sint ipsum. ',
              price: 'five',
              category: 'Clothes',
              seller_username: 'Lois James',
              charity_id: 5,
              location: 'Bristol',
            })
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            });
        });
        it('status 400 when body value violates null constraint', () => {
          return request(app)
            .post('/api/items')
            .send({
              thumbnail_img_ref: 'Saturn_test_2.jpg',
              fullsize_img_ref: 'earth-pic.jpg',
              title: 'Football boots - size 6',
              description:
                'Ad eiusmod non eiusmod aute nulla et laboris magna occaecat fugiat pariatur nostrud. Voluptate pariatur laboris est cillum irure eiusmod laboris commodo labore voluptate. Veniam cillum enim magna exercitation do quis qui sint irure exercitation sint ipsum. ',
              price: 5,
              category: 'Clothes',
              seller_username: 'Lois James',
              charity_id: 5,
              location: null,
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            });
        });
        it("status 404 when category is valid but doesn't exist", () => {
          return request(app)
            .post('/api/items')
            .send({
              thumbnail_img_ref: 'Saturn_test_2.jpg',
              fullsize_img_ref: 'earth-pic.jpg',
              title: 'Football boots - size 6',
              description:
                'Ad eiusmod non eiusmod aute nulla et laboris magna occaecat fugiat pariatur nostrud. Voluptate pariatur laboris est cillum irure eiusmod laboris commodo labore voluptate. Veniam cillum enim magna exercitation do quis qui sint irure exercitation sint ipsum. ',
              price: 5,
              category: 'Oranges',
              seller_username: 'Lois James',
              charity_id: 5,
              location: 'Bristol',
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Not Found');
            });
        });
        it("status 404 when seller is valid but doesn't exist", () => {
          return request(app)
            .post('/api/items')
            .send({
              thumbnail_img_ref: 'Saturn_test_2.jpg',
              fullsize_img_ref: 'earth-pic.jpg',
              title: 'Football boots - size 6',
              description:
                'Ad eiusmod non eiusmod aute nulla et laboris magna occaecat fugiat pariatur nostrud. Voluptate pariatur laboris est cillum irure eiusmod laboris commodo labore voluptate. Veniam cillum enim magna exercitation do quis qui sint irure exercitation sint ipsum. ',
              price: 5,
              category: 'Clothes',
              seller_username: 'Dave',
              charity_id: 5,
              location: 'Bristol',
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Not Found');
            });
        });
        it("status 404 when charity ID is valid but doesn't exist", () => {
          return request(app)
            .post('/api/items')
            .send({
              thumbnail_img_ref: 'Saturn_test_2.jpg',
              fullsize_img_ref: 'earth-pic.jpg',
              title: 'Football boots - size 6',
              description:
                'Ad eiusmod non eiusmod aute nulla et laboris magna occaecat fugiat pariatur nostrud. Voluptate pariatur laboris est cillum irure eiusmod laboris commodo labore voluptate. Veniam cillum enim magna exercitation do quis qui sint irure exercitation sint ipsum. ',
              price: 5,
              category: 'Clothes',
              seller_username: 'Lois James',
              charity_id: 999,
              location: 'Bristol',
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Not Found');
            });
        });
      });
    });
  });
});

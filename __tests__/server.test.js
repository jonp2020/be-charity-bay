const app = require('../server');
const request = require('supertest');
const connection = require('../db/connection');
const multiparty = require('multiparty');

beforeEach(() => {
  return connection.seed.run();
});

afterAll(() => {
  return connection.destroy();
});

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
    it('status 405 when invalid method', () => {
      const invalidMethods = ['delete', 'post', 'patch', 'put'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]('/api')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
    describe('GET', () => {
      it('status 200 and list of endpoints', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then(({ body: { endpoints } }) => {
            expect(Object.keys(endpoints[0])).toEqual(
              expect.arrayContaining(['path', 'methods', 'middleware'])
            );
          });
      });
    });
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
      it('status 405 when invalid method', () => {
        const invalidMethods = ['get', 'patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/image')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
      describe('POST', () => {
        // it('status 201 and object containing image', () => {
        //   const filePath =
        //     '/Users/jonathanparrott/Desktop/Northcoders/project/be-charity-bay/db/data/test-data/Saturn_test_1.jpeg';
        //   return request(app)
        //     .post('/api/image')
        //     .set({ connection: 'keep-alive' })
        //     .attach('file', filePath)
        //     .expect(201);
        // });
      });
      describe('/:image_id', () => {
        it('status 405 when invalid method', () => {
          const invalidMethods = ['get', 'post', 'patch', 'put'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]('/api/image/2')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed');
              });
          });
          return Promise.all(methodPromises);
        });
        describe('DELETE', () => {
          it('status 204', () => {
            return request(app)
              .delete('/api/image/1604593310193.jpg')
              .expect(204);
          });
        });
      });
    });
    describe('/items', () => {
      it('status 405 when invalid method', () => {
        const invalidMethods = ['delete', 'patch', 'put'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/items')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
      describe('GET', () => {
        it('status 200 and object containing array of default limit items and total item count', () => {
          return request(app)
            .get('/api/items')
            .expect(200)
            .then(({ body: { items, itemCount } }) => {
              expect(items).toHaveLength(10);
              expect(itemCount).toBe(50);
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
        it('status 200 and object containing only seller_username queried items', () => {
          const qb = { seller_username: 'Lois James' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(200)
            .then(({ body: { items } }) => {
              items.forEach((item) => {
                expect(item.seller_username).toBe('Lois James');
              });
            });
        });
        it('status 200 and object containing only second page', () => {
          const qb = { p: 2 };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(200)
            .then(({ body: { items } }) => {
              expect(items[0].item_id).toBe(12);
            });
        });
        it('status 200 and object containing only limited amount of items', () => {
          const qb = { limit: 2 };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(200)
            .then(({ body: { items } }) => {
              expect(items).toHaveLength(2);
            });
        });
        it('status 200 and object containing items sorted by thumbnail-img-ref in descending order', () => {
          return request(app)
            .get('/api/items')
            .expect(200)
            .then(({ body: { items } }) => {
              expect(items).toBeSortedBy('thumbnail_img_ref', {
                descending: true,
              });
            });
        });
        it('status 200 and object containing items sorted by thumbnail-img-ref in ascending order', () => {
          const qb = { order: 'asc' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(200)
            .then(({ body: { items } }) => {
              expect(items).toBeSortedBy('thumbnail_img_ref');
            });
        });

        it('status 200 and object containing items sorted by query', () => {
          const qb = { sortBy: 'price' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(200)
            .then(({ body: { items } }) => {
              expect(items).toBeSortedBy('price', {
                coerce: true,
                descending: true,
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

        it('status 400 when sortBy query is not valid', () => {
          const qb = { sortBy: 'bought' };
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
        it('status 404 when seller_username does not exist', () => {
          const qb = { seller_username: 'Paul' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('User Not Found');
            });
        });
        it('status 400 when page query is not valid', () => {
          const qb = { p: 'abc' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            });
        });
        it('status 400 when limit query is not valid', () => {
          const qb = { limit: 'abc' };
          return request(app)
            .get('/api/items')
            .query(qb)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
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
      describe('/:item_id', () => {
        it('status 405 when invalid method', () => {
          const invalidMethods = ['post', 'put'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]('/api/items/1')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed');
              });
          });
          return Promise.all(methodPromises);
        });
        describe('GET', () => {
          it('status 200 and object containing item', () => {
            return request(app)
              .get('/api/items/2')
              .expect(200)
              .then(({ body: { item } }) => {
                expect(Object.keys(item)).toEqual(
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
          it('status 400 when item_id is invalid', () => {
            return request(app)
              .get('/api/items/two')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad Request');
              });
          });
          it('status 404 when the item_id does not exist', () => {
            return request(app)
              .get('/api/items/999')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Item Not Found');
              });
          });
        });
        describe('PATCH', () => {
          it('status 200 and object containing patched item', () => {
            return request(app)
              .patch('/api/items/1')
              .send({ status: 'reserved', buyer: 'Juliana Parks' })
              .expect(200)
              .then(({ body: { item } }) => {
                expect(item.status).toBe('reserved');
                expect(item.buyer).toBe('Juliana Parks');
                expect(Object.keys(item)).toEqual(
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
          it('status 200 and object containing patched item when status is changed to purchased but buyer is not updated', () => {
            return request(app)
              .patch('/api/items/1')
              .send({ status: 'purchased' })
              .expect(200)
              .then(({ body: { item } }) => {
                expect(item.status).toBe('purchased');
              });
          });
          it('status 400 when item ID is invalid', () => {
            return request(app)
              .patch('/api/items/one')
              .send({ status: 'reserved', buyer: 'Juliana Parks' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad Request');
              });
          });
          it('status 404 when item ID does not exist', () => {
            return request(app)
              .patch('/api/items/999')
              .send({ status: 'reserved', buyer: 'Juliana Parks' })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Item Not Found');
              });
          });
          it('status 400 when values on body are wrong type', () => {
            return request(app)
              .patch('/api/items/1')
              .send({ status: 1, buyer: 2 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad Request');
              });
          });
          it('status 400 when the status key is missing on the body', () => {
            return request(app)
              .patch('/api/items/1')
              .send({ buyer: 'Juliana Parks' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad Request');
              });
          });
          it('status 400 when the status is set to reserved but there is no buyer on the body', () => {
            return request(app)
              .patch('/api/items/1')
              .send({ status: 'reserved' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad Request');
              });
          });
          it('status 400 when the status is not reserved or purchased', () => {
            return request(app)
              .patch('/api/items/1')
              .send({ status: 'bought', buyer: 'Juliana Parks' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad Request');
              });
          });
        });
        describe('DELETE', () => {
          it('status 204', () => {
            return request(app).delete('/api/items/1').expect(204);
          });
          it('status 404 when the item ID does not exist', () => {
            return request(app)
              .delete('/api/items/999')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Item Not Found');
              });
          });
          it('status 400 when the item ID is not valid', () => {
            return request(app)
              .delete('/api/items/one')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad Request');
              });
          });
        });
      });
    });
    describe('/users', () => {
      it('returns status 405 when invalid method', () => {
        const invalidMethods = ['get', 'delete', 'patch', 'put'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/users')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
      describe('POST', () => {
        it('status 201 object containing posted user', () => {
          const user = {
            username: 'paul James',
            email: 'loisjames@housedown.com',
            first_name: 'Lois',
            last_name: 'James',
            location: 'Leeds',
          };
          return request(app)
            .post('/api/users')
            .send(user)
            .expect(201)
            .then(({ body: { user } }) => {
              expect(user).toEqual({
                username: 'paul James',
                email: 'loisjames@housedown.com',
                first_name: 'Lois',
                last_name: 'James',
                location: 'Leeds',
              });
            });
        });
        it('status 400 when keys missing from body', () => {
          return request(app)
            .post('/api/users')
            .send({
              email: 'loisjames@housedown.com',
              first_name: 'Lois',
              last_name: 'James',
              location: 'Leeds',
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            });
        });
        it('status 400 when additional unneccesary keys on body', () => {
          return request(app)
            .post('/api/users')
            .send({
              username: 'paul James',
              email: 'loisjames@housedown.com',
              first_name: 'Lois',
              last_name: 'James',
              location: 'Leeds',
              place_of_birth: 'Manchester',
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            });
        });
        it('status 400 when values are invalid type', () => {
          return request(app)
            .post('/api/users')
            .send({
              username: 'paul James',
              email: 'loisjames@housedown.com',
              first_name: null,
              last_name: 'James',
              location: 'Leeds',
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad Request');
            });
        });
        it('status 400 when username already exists', () => {
          return request(app)
            .post('/api/users')
            .send({
              username: 'Lois James',
              email: 'loisjames@housedown.com',
              first_name: 'Lois',
              last_name: 'James',
              location: 'Leeds',
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Username already exists');
            });
        });
      });
      describe('/user', () => {
        describe('/:email', () => {
          it('status 405 and method not allowed', () => {
            const invalidMethods = ['post', 'delete', 'patch', 'put'];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]('/api/users/user/loisjames@housedown.com')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Method not allowed');
                });
            });
            return Promise.all(methodPromises);
          });
          describe('GET', () => {
            it('status 200 and object containing user', () => {
              return request(app)
                .get('/api/users/user/loisjames@housedown.com')
                .expect(200)
                .then(({ body: { user } }) => {
                  expect(user.email).toBe('loisjames@housedown.com');
                });
            });
            it('status 200 and object containing empty array when email does not exist', () => {
              return request(app)
                .get('/api/users/user/fwjdsjk@jsef.com')
                .expect(200)
                .then(({ body: { user } }) => {
                  expect(user).toEqual([]);
                });
            });
          });
        });
      });
      describe('/:username', () => {
        it('returns status 405 when invalid method', () => {
          const invalidMethods = ['post', 'delete', 'patch', 'put'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]('/api/users/Lois James')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed');
              });
          });
          return Promise.all(methodPromises);
        });
        describe('GET', () => {
          it('status 200 and object containing user', () => {
            return request(app)
              .get('/api/users/Lois James')
              .expect(200)
              .then(({ body: { user } }) => {
                expect(user.username).toBe('Lois James');
              });
          });
          it('status 200 and object containing empty array when username does not exist', () => {
            return request(app)
              .get('/api/users/Peter Griffin')
              .expect(200)
              .then(({ body: { user } }) => {
                expect(user).toEqual([]);
              });
          });
        });
      });
    });
  });
});

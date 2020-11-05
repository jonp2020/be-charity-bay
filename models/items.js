const connection = require('../db/connection');
const { checkExists } = require('./utils');

exports.selectItems = async (status, buyer, category) => {
  const items = await connection('items')
    .select('*')
    .modify((query) => {
      if (status) query.where('status', status);
      if (category) query.where('category', category);
      if (buyer) query.where('buyer', buyer);
    });
  if (!items.length) {
    await Promise.all([
      checkExists('categories', 'slug', category),
      checkExists('users', 'username', buyer),
    ]);
  }
  if (status) {
    if (
      status === 'available' ||
      status === 'reserved' ||
      status === 'purchased'
    ) {
      return items;
    } else {
      return Promise.reject({ status: 400, msg: 'Bad Request' });
    }
  }
  return items;
};

exports.insertItem = async (itemBody) => {
  const [item] = await connection('items').insert(itemBody, '*');
  return item;
};

exports.selectItemById = (item_id) => {};

exports.updateItemById = (status, item_id) => {};

exports.delItemById = (item_id) => {};

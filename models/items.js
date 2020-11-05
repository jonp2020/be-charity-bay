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

exports.selectItemById = async (item_id) => {
  const item = await connection('items')
    .select('*')
    .first()
    .where({ item_id: item_id });
  if (!item) {
    return Promise.reject({ status: 404, msg: 'Item Not Found' });
  }
  return item;
};

exports.updateItemById = async (status, buyer, item_id) => {
  if (status === 'purchased') {
    const [item] = await connection('items')
      .where({ item_id: item_id })
      .update({ status })
      .returning('*');
    if (!item) {
      return Promise.reject({ status: 404, msg: 'Item Not Found' });
    }
    return item;
  }
  if (status === 'reserved' && typeof buyer === 'string') {
    const [item] = await connection('items')
      .where({ item_id: item_id })
      .update({ status, buyer })
      .returning('*');
    if (!item) {
      return Promise.reject({ status: 404, msg: 'Item Not Found' });
    }
    return item;
  } else {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
};

exports.delItemById = async (item_id) => {
  const deletedRows = await connection('items')
    .where({ item_id: item_id })
    .del();
  if (deletedRows === 1) return;
  else return Promise.reject({ status: 404, msg: 'Item Not Found' });
};

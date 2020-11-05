const {
  selectItems,
  selectItemById,
  updateItemById,
  delItemById,
  insertItem,
} = require('../models/items');

exports.getItems = async (req, res) => {
  const {
    query: { status, buyer, category },
  } = req;
  const items = await selectItems(status, buyer, category);
  res.send({ items });
};

exports.postItem = async (req, res) => {
  const { body } = req;
  const item = await insertItem(body);
  res.status(201).send({ item });
};

exports.getItemById = async (req, res) => {
  const {
    params: { item_id },
  } = req;
  const item = await selectItemById(item_id);
};

exports.patchItemById = async (req, res) => {
  const {
    body: { status },
    params: { item_id },
  } = req;
  const patchedItem = await updateItemById(status, item_id);
};

exports.deleteItemById = async (req, res) => {
  const {
    params: { item_id },
  } = req;
  const deletedItem = await delItemById(item_id);
};

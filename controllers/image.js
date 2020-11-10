const { insertImage, deleteImageById } = require('../models/image');

exports.postImage = async (req, res) => {
  insertImage(req, (image) => {
    res.status(201).send({ image });
  });
};

exports.delImageById = async (req, res) => {
  const {
    params: { image_id },
  } = req;
  await deleteImageById(image_id);
  res.sendStatus(204);
};

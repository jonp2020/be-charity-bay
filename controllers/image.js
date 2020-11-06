const { insertImage, deleteImageById } = require('../models/image');

exports.postImage = async (req, res) => {
  const image = await insertImage(req);
  res.status(201).send({ image });
};

exports.delImageById = async (req, res) => {
  const {
    params: { image_id },
  } = req;
  await deleteImageById(image_id);
  res.sendStatus(204);
};

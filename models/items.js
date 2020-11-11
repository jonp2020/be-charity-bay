const connection = require("../db/connection");
const { checkExists } = require("./utils");

exports.selectItems = async (
  status,
  buyer,
  seller_username,
  category,
  p = 1,
  limit = 10,
  order = "desc",
  sortBy = "thumbnail_img_ref"
) => {
  
  if (p != Number(p) || limit != Number(limit)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (p < 1) p = 1;
  const offsetAmount = (p - 1) * limit;
  const items = await connection("items")
    .select("*")
    .limit(limit)
    .offset(offsetAmount)
    .orderBy(sortBy, order)
    .modify((query) => {
      if (status) query.where("status", status);
      if (category) query.where("category", category);
      if (buyer) query.where("buyer", buyer);
      if (seller_username) query.where("seller_username", seller_username);
    });
  const itemCount = await connection("items")
    .select("*")
    .modify((query) => {
      if (status) query.where("status", status);
      if (category) query.where("category", category);
      if (buyer) query.where("buyer", buyer);
      if (seller_username) query.where("seller_username", seller_username);
    });

  if (!items.length) {
    await Promise.all([
      checkExists("categories", "slug", category),
      checkExists("users", "username", buyer),
      checkExists("users", "username", seller_username),
    ]);
  }
  if (status) {
    if (
      status === "available" ||
      status === "reserved" ||
      status === "purchased"
    ) {
      return { items, itemCount: itemCount.length };
    } else {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
  }
  return { items, itemCount: itemCount.length };
};

exports.insertItem = async (itemBody) => {
  const [item] = await connection("items").insert(itemBody, "*");
  return item;
};

exports.selectItemById = async (item_id) => {
  const item = await connection("items")
    .select("*")
    .first()
    .where({ item_id: item_id });
  if (!item) {
    return Promise.reject({ status: 404, msg: "Item Not Found" });
  }
  return item;
};

exports.updateItemById = async (status, buyer, item_id) => {
  if (status === "purchased") {
    const [item] = await connection("items")
      .where({ item_id: item_id })
      .update({ status })
      .returning("*");
    if (!item) {
      return Promise.reject({ status: 404, msg: "Item Not Found" });
    }
    return item;
  }
  if (status === "reserved" && typeof buyer === "string") {
    const [item] = await connection("items")
      .where({ item_id: item_id })
      .update({ status, buyer })
      .returning("*");
    if (!item) {
      return Promise.reject({ status: 404, msg: "Item Not Found" });
    }
    return item;
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
};

exports.delItemById = async (item_id) => {
  const deletedRows = await connection("items")
    .where({ item_id: item_id })
    .del();
  if (deletedRows === 1) return;
  else return Promise.reject({ status: 404, msg: "Item Not Found" });
};

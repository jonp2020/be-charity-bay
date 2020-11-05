const { postUser } = require("../controllers/users");
const { handle405Error, withErrorHandling } = require("../errors");

const usersRouter = require("express").Router();

usersRouter.route("/").post(withErrorHandling(postUser)).all(handle405Error);
usersRouter.route("/:username").get().all();

module.exports = usersRouter;

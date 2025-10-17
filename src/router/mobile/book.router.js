const BookController = require("../../controller/mobile/book.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/").get(BookController.getAll);
router.route("/:id").get(BookController.getOne);

module.exports = router;

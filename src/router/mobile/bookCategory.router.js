const BookCategoryController = require("../../controller/mobile/bookCategory.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/").get(BookCategoryController.getAll);
router.route("/:id").get(BookCategoryController.getOne);
module.exports = router;

const BookCategoryController = require("../../controller/admin/bookCategory.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/").post(BookCategoryController.addNew);
router.route("/").get(BookCategoryController.getAll);
router.route("/:id").get(BookCategoryController.getOne);
router.route("/:id").put(BookCategoryController.updateOne);
router.route("/:id").delete(BookCategoryController.deleteOne);

module.exports = router;

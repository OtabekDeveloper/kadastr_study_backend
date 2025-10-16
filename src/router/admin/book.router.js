const BookController = require("../../controller/admin/book.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/").post(uploadFiles, BookController.addNew);
router.route("/").get(BookController.getAll);
router.route("/:id").get(BookController.getOne);
router.route("/:id").put(uploadFiles, BookController.updateOne);
router.route("/:id").delete(BookController.deleteOne);
router.route("/deletefile/:id").delete(BookController.deleteOneFile);

module.exports = router;

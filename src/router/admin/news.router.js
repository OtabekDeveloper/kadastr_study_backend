const NewsController = require("../../controller/admin/news.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/").post(uploadFiles, NewsController.addNew);
router.route("/").get(NewsController.getAll);
router.route("/:id").get(NewsController.getOne);
router.route("/:id").put(uploadFiles, NewsController.updateOne);
router.route("/:id").delete(NewsController.deleteOne);
router.route("/deletefile/:id").delete(NewsController.deleteOneFile);

module.exports = router;

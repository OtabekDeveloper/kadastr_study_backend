const LessonController = require("../../controller/admin/lesson.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/").post(uploadFiles, LessonController.addNew);
router.route("/").get(LessonController.getAll);
router.route("/:id").get(LessonController.getOne);
router.route("/:id").put(uploadFiles, LessonController.updateOne);
router.route("/:id").delete(LessonController.deleteOne);
router.route("/deletefile/:id").delete(LessonController.deleteOneFile);

module.exports = router;

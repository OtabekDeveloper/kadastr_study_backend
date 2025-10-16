const SubjectController = require("../../controller/admin/subject.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/").post(uploadFiles, SubjectController.addNew);
router.route("/").get(SubjectController.getAll);
router.route("/:id").get(SubjectController.getOne);
router.route("/:id").put(uploadFiles, SubjectController.updateOne);
router.route("/:id").delete(SubjectController.deleteOne);
router.route("/deletefile/:id").delete(SubjectController.deleteOneFile);

module.exports = router;

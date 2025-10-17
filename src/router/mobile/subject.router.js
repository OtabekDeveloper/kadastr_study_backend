const SubjectController = require("../../controller/mobile/subject.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/").get(SubjectController.getAll);
router.route("/:id").get(SubjectController.getOne);

module.exports = router;

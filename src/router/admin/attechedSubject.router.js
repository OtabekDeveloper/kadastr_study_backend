const AttechedSubjectController = require("../../controller/admin/attechedSubject.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/").post(uploadFiles, AttechedSubjectController.addNew);

module.exports = router;

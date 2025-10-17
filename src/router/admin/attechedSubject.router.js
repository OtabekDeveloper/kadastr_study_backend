const AttechedSubjectController = require("../../controller/admin/attechedSubject.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/").post(uploadFiles, AttechedSubjectController.addNew);
router.route("/").get(uploadFiles, AttechedSubjectController.getAllUserSubject);
router
  .route("/:id")
  .get(uploadFiles, AttechedSubjectController.getOneUserSubject);

router
  .route("/:id")
  .delete(uploadFiles, AttechedSubjectController.deleteUserFromSubject);

module.exports = router;

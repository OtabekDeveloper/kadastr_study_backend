const AttechedSubjectController = require("../../controller/admin/attechedSubject.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/").post(AttechedSubjectController.addNew);
router.route("/").get(AttechedSubjectController.getAllUserSubject);
router.route("/lessons").get(AttechedSubjectController.getAllAttachedLesson);
router
  .route("/lessons/:id")
  .get(AttechedSubjectController.getOneAttachedLesson);
router.route("/:id").get(AttechedSubjectController.getOneUserSubject);
router.route("/:id").delete(AttechedSubjectController.deleteUserFromSubject);

module.exports = router;

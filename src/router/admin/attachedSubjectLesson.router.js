const AttechedSubjectLessonController = require("../../controller/admin/attachedSubjectLesson.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);

router.route("/").get(AttechedSubjectLessonController.getAllAttachedLesson);
router.route("/:id").get(AttechedSubjectLessonController.getOneAttachedLesson);

module.exports = router;

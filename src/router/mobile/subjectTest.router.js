const AttechedSubjectLessonController = require("../../controller/admin/subjectTest.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);

router.route("/").get(AttechedSubjectLessonController.getAllSubjectTest);
router.route("/:id").get(AttechedSubjectLessonController.getOneSubjectTest);

module.exports = router;

const LessonController = require("../../controller/mobile/lesson.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/").get(LessonController.getAll);
router.route("/:id").get(LessonController.getOne);

module.exports = router;

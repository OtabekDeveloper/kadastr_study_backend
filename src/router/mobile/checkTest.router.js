const CheckTestController = require("../../controller/mobile/checkTest.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/starttest").post(CheckTestController.answerTestLessonSubject);
router.route("/finishtest").post(CheckTestController.finishTestLessonSubject);

router.route("/startfinal").post(CheckTestController.answerFinalTest);
router.route("/finishfinal").post(CheckTestController.finishFinalTest);

router.route("/continue").post(CheckTestController.ContinueFinalTest);
router.route("/completion").post(CheckTestController.CompletionTest);

module.exports = router;

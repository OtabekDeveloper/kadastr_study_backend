const CheckTestController = require("../../controller/mobile/checkTest.coontroller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/starttest").post(CheckTestController.answerTestLessonSubject);
router.route("/finishtest").post(CheckTestController.finishTestLessonSubject);

router.route("/startfinal").post(CheckTestController.answerFinalTest);
// router.route("/finishfinal").post(CheckTestController.finishFinalTest);

module.exports = router;

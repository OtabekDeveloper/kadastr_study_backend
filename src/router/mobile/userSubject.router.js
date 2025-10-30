const AttechedSubjectController = require("../../controller/mobile/userSubject.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
// router.route("/").post(AttechedSubjectController.addPublicCourses);
router.route("/").get(AttechedSubjectController.getAllUserSubject);

router.route("/certificate").get(AttechedSubjectController.myCertificates);

router.route("/certificate/:id").get(AttechedSubjectController.myCertificate);

router.route("/:id").get(AttechedSubjectController.getOneUserSubject);

module.exports = router;

const TestController = require("../../controller/admin/test.controller");

const authenticate = require("../../utils/authenticate");
const { uploadQuestionFiles } = require("../../utils/uploadTestFile");

const router = require("express").Router();

router.use(authenticate);
router.route("/").post(uploadQuestionFiles, TestController.addNewTest);
router.route("/").get(TestController.getAllTest);
router.route("/:id").get(TestController.getOneTest);
router.route("/:id").delete(TestController.deleteOneTest);

module.exports = router;

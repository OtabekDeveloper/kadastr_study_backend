const UserController = require("../../controller/mobile/user.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/:id").get(UserController.getOne);
router.route("/:id").put(uploadFiles, UserController.updateOne);

module.exports = router;

const router = require("express").Router();
const AuthController = require("../../controller/auth/auth.controller");

router.route("/").post(AuthController.login);
router.route("/mobile").post(AuthController.mobileLogin);

module.exports = router;

const router = require("express").Router();
const AuthController = require("../../controller/auth/auth.controller");

router.route("/").post(AuthController.login);

module.exports = router;

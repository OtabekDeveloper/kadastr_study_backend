const router = require("express").Router();
const AdminRouter = require("./router/admin/router");
const AuthRouter = require("./router/auth/router");
const MobileRouter = require("./router/mobile/router");

router.use("/auth", AuthRouter);
router.use("/admin", AdminRouter);
router.use("/mobile", MobileRouter);

module.exports = router;

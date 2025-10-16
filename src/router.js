const router = require("express").Router();
const AdminRouter = require("./router/admin/router");
const AuthRouter = require("./router/auth/router");

router.use("/auth", AuthRouter);
router.use("/admin", AdminRouter);

module.exports = router;

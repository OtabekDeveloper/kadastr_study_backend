const ReportController = require("../../controller/admin/report.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
// const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/").get( ReportController.reportGroupRating);

module.exports = router;

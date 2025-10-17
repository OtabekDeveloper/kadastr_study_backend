const ProvinceController = require("../../controller/mobile/province.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/:id").get(ProvinceController.getOne);

module.exports = router;

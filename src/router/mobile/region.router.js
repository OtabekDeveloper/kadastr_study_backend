const RegionController = require("../../controller/mobile/region.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/:id").get(RegionController.getOne);

module.exports = router;

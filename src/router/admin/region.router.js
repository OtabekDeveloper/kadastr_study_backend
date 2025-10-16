const RegionController = require("../../controller/admin/region.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/").post(RegionController.addNew);
router.route("/").get(RegionController.getAll);
router.route("/:id").get(RegionController.getOne);
router.route("/:id").put(RegionController.updateOne);
router.route("/:id").delete(RegionController.deleteOne);

module.exports = router;

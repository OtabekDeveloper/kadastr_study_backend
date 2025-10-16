const ProvinceController = require("../../controller/admin/province.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/").post(ProvinceController.addNew);
router.route("/").get(ProvinceController.getAll);
router.route("/:id").get(ProvinceController.getOne);
router.route("/:id").put(ProvinceController.updateOne);
router.route("/:id").delete(ProvinceController.deleteOne);

module.exports = router;

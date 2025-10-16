const GroupController = require("../../controller/admin/group.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/").post(GroupController.addNew);
router.route("/").get(GroupController.getAll);
router.route("/:id").get(GroupController.getOne);
router.route("/:id").put(GroupController.updateOne);
router.route("/:id").delete(GroupController.deleteOne);

module.exports = router;

const GroupController = require("../../controller/mobile/group.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/:id").get(GroupController.getOne);

module.exports = router;

const YoutubeController = require("../../controller/admin/youtube.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/").post(YoutubeController.addNew);
router.route("/").get(YoutubeController.getAll);
router.route("/:id").get(YoutubeController.getOne);
router.route("/:id").put(YoutubeController.updateOne);
router.route("/:id").delete(YoutubeController.deleteOne);

module.exports = router;

const YoutubeController = require("../../controller/mobile//youtube.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/").get(YoutubeController.getAll);
router.route("/:id").get(YoutubeController.getOne);

module.exports = router;

const NewsController = require("../../controller/mobile/news.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();

router.use(authenticate);
router.route("/").get(NewsController.getAll);
router.route("/:id").get(NewsController.getOne);

module.exports = router;

const UserController = require("../../controller/admin/user.controller");
const authenticate = require("../../utils/authenticate");
const router = require("express").Router();
const { uploadFiles } = require("../../utils/uploadFile");

router.use(authenticate);
router.route("/").post(uploadFiles, UserController.addNew);
router.route("/").get(UserController.getAll);
router.route("/certificate").get(UserController.getAllCertificates);
router.route("/certificate/:id").get(UserController.oneCertificate);
router.route("/:id").get(UserController.getOne);
router.route("/:id").put(uploadFiles, UserController.updateOne);
router.route("/:id").delete(UserController.deleteOne);
router.route("/deletefile/:id").delete(UserController.deleteOneFile);

module.exports = router;

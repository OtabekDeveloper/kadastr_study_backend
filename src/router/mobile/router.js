const router = require("express").Router();

const ProvinceRouter = require("./province.router");
const RegionRouter = require("./region.router");
const BookCategoryRouter = require("./bookCategory.router");
const BookRouter = require("./book.router");
const NewsRouter = require("./news.router");
const GroupRouter = require("./group.router");
const UserRouter = require("./user.router");
const SubjectRouter = require("./subject.router");
const LessonRouter = require("./lesson.router");
const UserSubjectRouter = require("./userSubject.router");
const CheckTetsRouter = require("./checkTest.router");
const SubjectTestRouter = require("./subjectTest.router");
const YoutubeRouter = require("./youtube.router")

router.use("/user", UserRouter);
router.use("/province", ProvinceRouter);
router.use("/region", RegionRouter);
router.use("/bookcategory", BookCategoryRouter);
router.use("/book", BookRouter);
router.use("/news", NewsRouter);
router.use("/group", GroupRouter);
router.use("/subject", SubjectRouter);
router.use("/lesson", LessonRouter);
router.use("/user-subject", UserSubjectRouter);
router.use("/attached", CheckTetsRouter);
router.use("/subjecttest", SubjectTestRouter);
router.use("/youtube", YoutubeRouter)

module.exports = router;

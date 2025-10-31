const router = require("express").Router();
const ProvinceRouter = require("./province.router");
const RegionRouter = require("./region.router");
const BookCategoryRouter = require("./bookCategory.router");
const BookRouter = require("./book.router");
const NewsRouter = require("./news.router");
const GroupRouter = require("./group.router");
const UserRouter = require("./user.router");
const SubjectRouter = require("./subject.router");
const SubjectTestRouter = require("./subjectTest.router");
const LessonRouter = require("./lesson.router");
const TestRouter = require("./test.router");
const AttechedRouter = require("./attechedSubject.router");
const AttachedLessonRouter = require("./attachedSubjectLesson.router");
const ReportRouter = require("./report.router")
const YoutubeRouter = require("./youtube.router")

router.use("/attachedlesson", AttachedLessonRouter);
router.use("/province", ProvinceRouter);
router.use("/region", RegionRouter);
router.use("/bookcategory", BookCategoryRouter);
router.use("/book", BookRouter);
router.use("/news", NewsRouter);
router.use("/group", GroupRouter);
router.use("/user", UserRouter);
router.use("/subject", SubjectRouter);
router.use("/subjecttest", SubjectTestRouter);
router.use("/lesson", LessonRouter);
router.use("/test", TestRouter);
router.use("/atteched-subject", AttechedRouter);
router.use("/report/group-reting", ReportRouter)
router.use("/youtube", YoutubeRouter)

module.exports = router;

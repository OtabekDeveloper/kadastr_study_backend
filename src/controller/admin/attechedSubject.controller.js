const AttachedModel = require("../../models/attechedSubject.model");
const SubjectModel = require("../../models/subject.model");
const LessonModel = require("../../models/lesson.model");
const UserModel = require("../../models/user.model");
const UserSubject = require("../../models/userSubject.model")
const { deleteFile } = require("../../utils/deleteFile");

module.exports = {
  // Yo'nalish qo'shish
  addNew: async (req, res) => {
    try {
      const { user, subject } = req.body

      const userData = await UserModel.findById(user)
        .populate({ path: "group", select: ["startDate", "endDate"], strictPopulate: false })

      if (!userData) {
        return res.status(400).json({ message: "user not found" })
      }

      const SubjectData = await SubjectModel.findById(subject)

      if (!SubjectData) {
        return res.status(400).json({ message: "Subjct not found" })
      }

      await UserSubject.create({
        subject,
        user,
        date: moment().format("YYYY-MM-DD"),
        startDate: user?.group?.startDate,
        endDate: user?.group?.endDate,
        complateCount: { type: Number, default: 0 }, // default:0
      })

      const lessons = await LessonModel.find({ subject })

      for (let i = 0; i < lessons?.length; i++) {
        await AttachedModel.create({
          subject,
          lesson: lessons[i],
          user: user,
          isPassed: false,
          lessonStep: lessons[i]?.step
        })
      }

      return res.status(201).json({ message: "success" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },


};

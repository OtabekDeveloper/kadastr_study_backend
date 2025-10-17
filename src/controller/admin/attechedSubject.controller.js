const AttachedModel = require("../../models/attechedSubject.model");
const SubjectModel = require("../../models/subject.model");
const LessonModel = require("../../models/lesson.model");
const UserModel = require("../../models/user.model");
const UserSubject = require("../../models/userSubject.model");
const { deleteFile } = require("../../utils/deleteFile");
const moment = require("moment");

module.exports = {
  // Yo'nalish qo'shish
  addNew: async (req, res) => {
    try {
      const { user, subject } = req.body;

      const userData = await UserModel.findById(user).populate({
        path: "group",
        select: ["startDate", "endDate"],
        strictPopulate: false,
      });

      if (!userData) {
        return res.status(400).json({ message: "user not found" });
      }

      const SubjectData = await SubjectModel.findById(subject);

      if (!SubjectData) {
        return res.status(400).json({ message: "Subjct not found" });
      }

      const attachedSubject = await UserSubject.findOne({ subject, user });

      if (attachedSubject) {
        return res.status(400).json({ message: "Subject allready attached" });
      }

      const lessons = await LessonModel.find({ subject });
      for (let i = 0; i < lessons?.length; i++) {
        await AttachedModel.create({
          subject,
          lesson: lessons[i],
          user: user,
          isPassed: false,
          lessonStep: lessons[i]?.step,
        });
      }
      await UserSubject.create({
        subject,
        user,
        date: moment().format("YYYY-MM-DD"),
        startDate: userData?.group?.startDate,
        endDate: userData?.group?.endDate,
        complateCount: 0,
        totalLesson: lessons?.length,
      });

      return res.status(201).json({ message: "success" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getAllUserSubject: async (req, res) => {
    try {
      const { page, limit, user, subject } = req.query;

      const filter = {};
      if (user) filter.user = user;
      if (subject) filter.subject = subject;

      if (page && limit) {
        const options = {
          page: parseInt(page),
          limit: parseInt(limit),
          sort: { createdAt: -1 },
          populate: [
            {
              path: "subject",
              select: "title desc photo active isPublic",
            },
            {
              path: "user",
              select: "firstName lastName photo group",
              populate: {
                path: "group",
                select: "name startDate endDate",
              },
            },
          ],
        };

        const data = await UserSubject.paginate(filter, options);

        return res.status(200).json(data);
      } else {
        const data = await UserSubject.find(filter)
          .sort({ createdAt: -1 })
          .populate({
            path: "subject",
            select: "title desc photo active isPublic",
          })
          .populate({
            path: "user",
            select: "firstName lastName photo group",
            populate: {
              path: "group",
              select: "name startDate endDate",
            },
          });

        return res.status(200).json(data);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getOneUserSubject: async (req, res) => {
    try {
      const { id } = req.params;
      const userSubject = await UserSubject.findById(id)
        .populate({
          path: "subject",
          select: "title desc photo active isPublic",
        })
        .populate({
          path: "user",
          select: "firstName lastName photo group",
          populate: {
            path: "group",
            select: "name startDate endDate",
          },
        });

      if (!userSubject) {
        return res.status(404).json({ message: "UserSubject not found" });
      }

      return res.status(200).json(userSubject);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  deleteUserFromSubject: async (req, res) => {
    try {
      const { id } = req.params;
      const userSubject = await UserSubject.findById(id);

      if (!userSubject) {
        return res.status(404).json({ message: "UserSubject not found" });
      }

      const { user, subject } = userSubject;

      await UserSubject.findByIdAndDelete(id);

      await AttachedModel.deleteMany({ user, subject });

      return res
        .status(200)
        .json({ message: "User and attached lessons deleted successfully" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

const LessonModel = require("../../models/lesson.model");
const SubjectModel = require("../../models/subject.model");
const UserModel = require("../../models/user.model");
const UserSubject = require("../../models/userSubject.model");
const AttachedModel = require("../../models/attechedSubject.model");
const moment = require("moment");

module.exports = {
  getAllUserSubject: async (req, res) => {
    try {
      const { page, limit, subject } = req.query;
      const userId = req.user?._id;

      if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
      }

      const filter = { user: userId };
      if (subject) filter.subject = subject;

      if (page && limit) {
        const options = {
          page: parseInt(page),
          limit: parseInt(limit),
          sort: { createdAt: -1 },
          populate: [
            {
              path: "subject",
              select: "title desc photo active isPublic certificate certificate_code",
            }
          ],
          select: ["-user", "-createdAt", "-updatedAt"]
        };

        const data = await UserSubject.paginate(filter, options);

        return res.status(200).json(data);
      } else {
        const data = await UserSubject.find(filter)
          .sort({ createdAt: -1 })
          .populate({
            path: "subject",
            select: "title desc photo active isPublic certificate certificate_code",
          })
          .select(["-user", "-createdAt", "-updatedAt"])

        return res.status(200).json(data);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getOneUserSubject: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
      }

      const data = await UserSubject.findOne({
        _id: id,
        user: userId,
      })
        .populate({
          path: "subject",
          select: "title desc photo active isPublic certificate certificate_code",
        })
        .select(["-user", "-createdAt", "-updatedAt"])

      if (!data) {
        return res.status(404).json({ message: "User subject not found" });
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  addPublicCourses: async (req, res) => {
    try {
      const { subject } = req.body;
      const user = req.user?._id;
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

  myCertificates: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const userId = req.user?._id;

      if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
      }

      const filter = { user: userId, certificate: { $ne: null } };

      if (page && limit) {
        const options = {
          page: parseInt(page),
          limit: parseInt(limit),
          sort: { createdAt: -1 },
          populate: [
            {
              path: "subject",
              select: "title desc photo certificate certificate_code",
            }
          ],
          select: ["-user", "-createdAt", "-updatedAt"]
        };

        const data = await UserSubject.paginate(filter, options);

        return res.status(200).json(data);
      } else {
        const data = await UserSubject.find(filter)
          .sort({ createdAt: -1 })
          .populate({
            path: "subject",
            select: "title desc photo certificate certificate_code",
          })
          .select(["-user", "-createdAt", "-updatedAt"])

        return res.status(200).json(data);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  myCertificate: async (req, res) => {
    try {
      const userId = req.user?._id;
      const { id } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
      }

      const data = await UserSubject.findById(id)
        .populate({
          path: "subject",
          select: "title desc photo active isPublic certificate certificate_code",
        })
        .select(["-user", "-createdAt", "-updatedAt"])

      if (!data) {
        return res.status(404).json({ message: "certificate not found" });
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

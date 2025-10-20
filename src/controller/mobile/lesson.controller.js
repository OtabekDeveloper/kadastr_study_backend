const LessonModel = require("../../models/attechedSubject.model");

module.exports = {
  getAll: async function (req, res) {
    try {
      const { search, subject } = req.query;
      let data = {};
      const page = parseInt(req.query?.page);
      const limit = parseInt(req.query?.limit);
      data["user"] = req.user?._id;
      const options = {
        sort: { createdAt: 1, step: 1 },
        page: page,
        limit: limit,
        populate: [
          {
            path: "subject",
            select: ["-createdAt", "-updatedAt"],
          },
          {
            path: "lesson",
            select: ["-createdAt", "-updatedAt"],
          },
        ],
      };

      if (search) {
        data["title"] = {
          $regex: new RegExp(search, "i"),
        };
      }

      if (subject) {
        data["subject"] = subject;
      }

      let docs;

      if (limit && page) {
        docs = await LessonModel.paginate(data, options);
      } else {
        docs = await LessonModel.find(data)
          .sort({ createdAt: 1, step: 1 })
          .populate([
            {
              path: "subject",
              select: ["-createdAt", "-updatedAt"],
            },
            {
              path: "lesson",
              select: ["-createdAt", "-updatedAt"],
            },
          ]);
      }

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getOne: async function (req, res) {
    try {
      const result = await LessonModel.findById(req.params.id).populate([
        {
          path: "subject",
        },
      ]);
      if (!result) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

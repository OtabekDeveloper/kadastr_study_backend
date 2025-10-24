const AttachedModel = require("../../models/attechedSubject.model");

module.exports = {
  getAllAttachedLesson: async (req, res) => {
    try {
      const { subject, user, lesson, limit, page } = req.query;
      let data = {};

      if (subject) {
        data["subject"] = subject;
      }

      if (user) {
        data["user"] = user;
      }

      if (lesson) {
        data["lesson"] = lesson;
      }

      let options = {
        page: page,
        limit: limit,
        populate: [
          {
            path: "subject",
            select: ["title"],
          },
          {
            path: "lesson",
            select: ["title"],
          },
          {
            path: "user",
            select: ["firstName", "lastName", "middleName"],
          },
        ],
        select: ["-result"],
        sort: { lessonStep: 1 }
      };
      let docs;
      if (limit && page) {
        docs = await AttachedModel.paginate(data, options);
      } else {
        docs = await AttachedModel.find(data)
          .populate([
            {
              path: "subject",
              select: ["title"],
            },
            {
              path: "lesson",
              select: ["title"],
            },
            {
              path: "user",
              select: ["firstName", "lastName", "middleName"],
            },
          ])
          .select(["-result"])
          .sort({lessonStep: 1});
      }

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getOneAttachedLesson: async (req, res) => {
    try {
      const doc = await AttachedModel.findById(req.params.id).populate([
        {
          path: "subject",
          select: ["title"],
        },
        {
          path: "lesson",
          select: ["title"],
        },
        {
          path: "user",
          select: ["firstName", "lastName", "middleName"],
        },
      ]);

      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }

      return res.status(200).json(doc);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

const SubjectTestModel = require("../../models/SubjectTest.model");

module.exports = {
  getAllSubjectTest: async (req, res) => {
    try {
      const { subject, limit, page, isPassed, testType } = req.query;
      let data = {};

      if (subject) {
        data["subject"] = subject;
      }
      if (testType) {
        data["testType"] = testType;
      }
      data["user"] = req.user?._id;

      if (typeof isPassed !== "undefined") {
        data["isPassed"] = isPassed === "true";
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
            path: "user",
            select: ["firstName", "lastName", "middleName"],
          },
        ],
        select: ["-questions"],
      };
      let docs;
      if (limit && page) {
        docs = await SubjectTestModel.paginate(data, options);
      } else {
        docs = await SubjectTestModel.find(data)
          .populate([
            {
              path: "subject",
              select: ["title"],
            },
            {
              path: "user",
              select: ["firstName", "lastName", "middleName"],
            },
          ])
          .select("-questions");
      }

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getOneSubjectTest: async (req, res) => {
    try {
      const doc = await SubjectTestModel.findById(req.params.id).populate([
        {
          path: "subject",
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

const NewsModel = require("../../models/news.model");
const { deleteFile } = require("../../utils/deleteFile");
const moment = require("moment");
const UserSubjectModel = require("../../models/userSubject.model");

module.exports = {
  // user larni guruh boyicha reytingi
  reportGroupRating: async function (req, res) {
    try {
      const { group, subject } = req.query;

      // if (!subject || !group) {
      //   return res.status(400).json({ message: "subject and group required" });
      // }

      const data = {};

      if (subject) {
        data["subject"] = subject;
      }

      if (group) {
        data["group"] = group;
      }

      const page = parseInt(req.query?.page);
      const limit = parseInt(req.query?.limit);

      const options = {
        sort: { reytingSubject: -1, reytingLesson: -1 },
        page: page,
        limit: limit,
        populate: [
          {
            path: "user",
            select: ["firstName", "lastName", "middleName"],
          },
          {
            path: "group",
            select: ["title"],
          },
          {
            path: "subject",
            select: ["title"],
          },
        ],
        select: [
          "user",
          "isComplated",
          "reytingLesson",
          "reytingSubject",
          "subject",
          "group",
        ],
      };

      let docs;
      if (limit && page) {
        docs = await UserSubjectModel.paginate(data, options);
      } else {
        docs = await UserSubjectModel.find(data)
          .sort({ reytingSubject: -1, reytingLesson: -1 })
          .populate([
            {
              path: "user",
              select: ["firstName", "lastName", "middleName"],
            },
            {
              path: "group",
              select: ["title"],
            },
            {
              path: "subject",
              select: ["title"],
            },
          ])
          .select([
            "user",
            "isComplated", // true-fanni tugatgan , false - tugatmagan
            "reytingLesson",
            "reytingSubject",
            "subject",
            "group",
          ]);
      }

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

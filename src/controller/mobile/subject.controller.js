const SubjectModel = require("../../models/subject.model");
const UserSubjectModel = require("../../models/userSubject.model")

module.exports = {
  getAll: async function (req, res) {
    try {
      const { search, isPublic, active } = req.query;
      let data = {};
      const userId = req.user?._id;
      const page = parseInt(req.query?.page);
      const limit = parseInt(req.query?.limit);

      const options = {
        sort: { title: 1, createdAt: 1 },
        page: page,
        limit: limit,
      };

      if (search) {
        data["title"] = {
          $regex: new RegExp(search, "i"),
        };
      }

      const userSubjects = await UserSubjectModel.find({ user: userId }).lean();

      const userSubjectIds = userSubjects.map(pe => pe?.subject.toString());


      data.isPublic = true;
      data.active = true;

      let docs;

      if (limit && page) {
        docs = await SubjectModel.paginate({
          _id: { $nin: userSubjectIds },
          ...data
        }, options);
      } else {
        docs = await SubjectModel.find({
          _id: { $nin: userSubjectIds },
          ...data
        }).sort({ title: 1, createdAt: 1 });
      }

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getOne: async function (req, res) {
    try {
      const result = await SubjectModel.findById(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

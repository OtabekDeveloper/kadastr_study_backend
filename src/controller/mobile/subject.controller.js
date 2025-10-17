const SubjectModel = require("../../models/subject.model");

module.exports = {
  getAll: async function (req, res) {
    try {
      const { search, isPublic, active } = req.query;
      let data = {};
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
      if (active !== undefined) {
        data.active = active === "true";
      }

      // if (isPublic !== undefined) {
      //   data.isPublic = isPublic === "true";
      // }

      data.isPublic = true;

      let docs;

      if (limit && page) {
        docs = await SubjectModel.paginate(data, options);
      } else {
        docs = await SubjectModel.find(data).sort({ title: 1, createdAt: 1 });
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

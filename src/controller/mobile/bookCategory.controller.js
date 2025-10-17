const BookCategoryModel = require("../../models/bookCategory.model");

module.exports = {
  getAll: async function (req, res) {
    try {
      const { search } = req.query;
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

      let docs;

      if (limit && page) {
        docs = await BookCategoryModel.paginate(data, options);
      } else {
        docs = await BookCategoryModel.find(data).sort({
          title: 1,
          createdAt: 1,
        });
      }

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getOne: async function (req, res) {
    try {
      const result = await BookCategoryModel.findById(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

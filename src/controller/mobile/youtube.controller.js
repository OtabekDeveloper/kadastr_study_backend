const YoutubeModel = require("../../models/youtube.model");

module.exports = {
  getAll: async function (req, res) {
    try {
      const { search } = req.query;
      let data = {};
      const page = parseInt(req.query?.page);
      const limit = parseInt(req.query?.limit);

      const options = {
        sort: { createdAt: 1 },
        page: page,
        limit: limit,
        select: ["title", "link", "date"]
      };

      if (search) {
        data["title"] = {
          $regex: new RegExp(search, "i"),
        };
      }
      data["active"] = true

      let docs;

      if (limit && page) {
        docs = await YoutubeModel.paginate(data, options);
      } else {
        docs = await YoutubeModel.find(data).sort({ createdAt: 1 }).select(["title", "link", "date"]);
      }

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getOne: async function (req, res) {
    try {
      const result = await YoutubeModel.findById(req.params.id).select(["title", "link", "date"]);
      if (!result) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

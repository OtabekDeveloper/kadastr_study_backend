const RegionModel = require("../../models/region.model");

module.exports = {
  getOne: async function (req, res) {
    try {
      const result = await RegionModel.findById(req.params.id).populate([
        {
          path: "province",
          select: ["title"],
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

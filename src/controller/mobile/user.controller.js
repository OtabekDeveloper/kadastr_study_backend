const UserModel = require("../../models/user.model");

module.exports = {
  getOne: async function (req, res) {
    try {
      const result = await UserModel.findById(req.params.id).populate([
        {
          path: "province",
          select: ["title"],
        },
        {
          path: "region",
          select: ["title"],
        },
        {
          path: "group",
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

  updateOne: async function (req, res) {
    try {
      const doc = await UserModel.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }
      const result = await UserModel.findByIdAndUpdate(req.params.id, {
        ...req.body,
        photo: req.body.file,
      });
      if (!result) {
        return res
          .status(400)
          .json({ message: "Ma'lumot yangilashda xatolik" });
      }
      return res.status(200).json({ message: "success" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

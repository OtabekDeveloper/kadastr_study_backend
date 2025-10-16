const RegionModel = require("../../models/region.model");

module.exports = {
  addNew: async (req, res) => {
    try {
      const doc = new RegionModel(req.body);
      const result = await doc.save();
      if (!result) {
        return res.status(400).json({ message: "Ma'lumot yaratishda xatolik" });
      }
      return res.status(201).json({ message: "success" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getAll: async function (req, res) {
    try {
      const { search, province } = req.query;
      let data = {};
      const page = parseInt(req.query?.page);
      const limit = parseInt(req.query?.limit);

      const options = {
        sort: { title: 1, createdAt: 1 },
        page: page,
        limit: limit,
        populate: [
          {
            path: "province",
            select: ["title"],
          },
        ],
      };

      if (search) {
        data["title"] = {
          $regex: new RegExp(search, "i"),
        };
      }

      if (province) {
        data["province"] = province;
      }

      let docs;

      if (limit && page) {
        docs = await RegionModel.paginate(data, options);
      } else {
        docs = await RegionModel.find(data)
          .sort({ title: 1, createdAt: 1 })
          .populate([
            {
              path: "province",
              select: ["title"],
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

  updateOne: async function (req, res) {
    try {
      const doc = await RegionModel.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }
      const result = await RegionModel.findByIdAndUpdate(
        req.params.id,
        req.body
      );
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

  deleteOne: async function (req, res) {
    try {
      const doc = await RegionModel.findById(req.params.id);

      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }

      const result = await RegionModel.findByIdAndDelete(req.params.id);

      if (!result) {
        return res
          .status(400)
          .json({ message: "Ma'lumot o'chirishda xatolik" });
      }

      return res.status(200).json({ message: "success" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

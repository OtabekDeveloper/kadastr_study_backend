const UserModel = require("../../models/user.model");
const { deleteFile } = require("../../utils/deleteFile");

module.exports = {
  addNew: async (req, res) => {
    try {
      const doc = new UserModel({ ...req.body, photo: req.body.file });
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
      const { search, province, region, group } = req.query;
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
          {
            path: "region",
            select: ["title"],
          },
          {
            path: "group",
            select: ["title"],
          },
        ],
      };

      if (search) {
        data["$or"] = [
          { firstName: { $regex: new RegExp(search, "i") } },
          { lastName: { $regex: new RegExp(search, "i") } },
          { middleName: { $regex: new RegExp(search, "i") } },
        ];
      }

      if (province) {
        data["province"] = province;
      }

      if (region) {
        data["region"] = region;
      }

      if (group) {
        data["group"] = group;
      }

      let docs;

      if (limit && page) {
        docs = await UserModel.paginate(data, options);
      } else {
        docs = await UserModel.find(data)
          .sort({ title: 1, createdAt: 1 })
          .populate([
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
      }

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

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

  deleteOne: async function (req, res) {
    try {
      const doc = await UserModel.findById(req.params.id);

      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }

      await deleteFile(doc?.file);

      const result = await UserModel.findByIdAndDelete(req.params.id);

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

  deleteOneFile: async (req, res) => {
    try {
      const doc = await UserModel.findById(req.params.id);

      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }

      if (doc.photo) {
        await deleteFile(doc.photo);
      }

      doc.photo = null;
      await doc.save();

      return res
        .status(200)
        .json({ message: "Fayl muvaffaqiyatli o'chirildi" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

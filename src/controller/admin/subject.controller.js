const SubjectModel = require("../../models/subject.model");
const AttachedModel = require("../../models/attechedSubject.model");
const { deleteFile } = require("../../utils/deleteFile");

module.exports = {
  addNew: async (req, res) => {
    try {
      const doc = new SubjectModel({ ...req.body, photo: req.body.file });
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
      if (isPublic !== undefined) {
        data.isPublic = isPublic === "true";
      }
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

  updateOne: async function (req, res) {
    try {
      const doc = await SubjectModel.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }
      const result = await SubjectModel.findByIdAndUpdate(req.params.id, {
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
      const doc = await SubjectModel.findById(req.params.id);

      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }

      const sub = await AttachedModel.findOne({ subject: doc?._id })

      if (sub) {
        return res.status(400).json({ message: "Action not allowed, subject attached to user" })
      }

      await deleteFile(doc.photo);

      const result = await SubjectModel.findByIdAndDelete(req.params.id);
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
      const doc = await SubjectModel.findById(req.params.id);

      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }

      if (doc?.photo) {
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

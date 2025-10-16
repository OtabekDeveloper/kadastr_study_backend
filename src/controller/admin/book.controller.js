const BookModel = require("../../models/book.model");
const { deleteFile } = require("../../utils/deleteFile");

module.exports = {
  addNew: async (req, res) => {
    try {
      const doc = new BookModel(req.body);
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
      const { search, bookcategory } = req.query;
      let data = {};
      const page = parseInt(req.query?.page);
      const limit = parseInt(req.query?.limit);

      const options = {
        sort: { title: 1, createdAt: 1 },
        page: page,
        limit: limit,
        populate: [
          {
            path: "bookcategory",
            select: ["title"],
          },
        ],
      };

      if (search) {
        data["title"] = {
          $regex: new RegExp(search, "i"),
        };
      }

      if (bookcategory) {
        data["bookcategory"] = bookcategory;
      }

      let docs;

      if (limit && page) {
        docs = await BookModel.paginate(data, options);
      } else {
        docs = await BookModel.find(data)
          .sort({ title: 1, createdAt: 1 })
          .populate([
            {
              path: "bookcategory",
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
      const result = await BookModel.findById(req.params.id).populate([
        {
          path: "bookcategory",
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
      const doc = await BookModel.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }
      const result = await BookModel.findByIdAndUpdate(req.params.id, req.body);
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
      const doc = await BookModel.findById(req.params.id);

      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }

      await deleteFile(doc?.file);

      const result = await BookModel.findByIdAndDelete(req.params.id);

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
      const doc = await BookModel.findById(req.params.id);

      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }

      if (doc.file) {
        await deleteFile(doc.file);
      }

      doc.file = null;
      await doc.save();

      return res
        .status(200)
        .json({ message: "Fayl muvaffaqiyatli o'chirildi" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

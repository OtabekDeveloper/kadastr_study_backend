const NewsModel = require("../../models/news.model");
const { deleteFile } = require("../../utils/deleteFile");

module.exports = {
  addNew: async (req, res) => {
    try {
      const doc = new NewsModel({ ...req.body, media: req.body?.files });
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
        sort: { createdAt: 1 },
        page: page,
        limit: limit,
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
        docs = await NewsModel.paginate(data, options);
      } else {
        docs = await NewsModel.find(data).sort({ createdAt: 1 });
      }

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  getOne: async function (req, res) {
    try {
      const result = await NewsModel.findById(req.params.id);
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
      const doc = await NewsModel.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }
      const result = await NewsModel.findByIdAndUpdate(req.params.id, {
        ...req.body,
        media: req.body?.files,
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
      const doc = await NewsModel.findById(req.params.id);

      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }

      for (const filePath of doc.media) {
        deleteFile(filePath);
      }

      const result = await NewsModel.findByIdAndDelete(req.params.id);

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
      const { filePath } = req.body;
      const news = await NewsModel.findById(req.params.id);

      if (!news) {
        return res.status(404).json({ message: "Yangilik topilmadi" });
      }

      if (filePath && news.media?.includes(filePath)) {
        await deleteFile(filePath);

        news.media = news.media.filter((m) => m !== filePath);

        await news.save();
      }

      return res
        .status(200)
        .json({ message: "Fayl muvaffaqiyatli o'chirildi" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

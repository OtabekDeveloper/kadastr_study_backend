const LessonModel = require("../../models/lesson.model");
const SubjectModel = require("../../models/subject.model");
const { deleteFile } = require("../../utils/deleteFile");

module.exports = {
  addNew: async (req, res) => {
    try {
      const doc = new LessonModel({
        ...req.body,
        docs: req.body?.docs,
        video: req.body?.file,
      });

      await SubjectModel.findByIdAndUpdate(req?.body?.subject, { $inc: { lessonCount: 1 } })

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
      const { search, subject } = req.query;
      let data = {};
      const page = parseInt(req.query?.page);
      const limit = parseInt(req.query?.limit);

      const options = {
        sort: { createdAt: 1, step: 1 },
        page: page,
        limit: limit,
        populate: [
          {
            path: "subject",
          },
        ],
      };

      if (search) {
        data["title"] = {
          $regex: new RegExp(search, "i"),
        };
      }

      if (subject) {
        data["subject"] = subject;
      }

      let docs;

      if (limit && page) {
        docs = await LessonModel.paginate(data, options);
      } else {
        docs = await LessonModel.find(data)
          .sort({ createdAt: 1, step: 1 })
          .populate([
            {
              path: "subject",
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
      const result = await LessonModel.findById(req.params.id).populate([
        {
          path: "subject",
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
      const doc = await LessonModel.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }
      const result = await LessonModel.findByIdAndUpdate(req.params.id, {
        ...req.body,
        docs: req.body?.docs,
        video: req.body?.file,
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
      const doc = await LessonModel.findById(req.params.id);

      if (!doc) {
        return res.status(404).json({ message: "Ma'lumot topilmadi" });
      }

      for (const filePath of doc.docs) {
        deleteFile(filePath.path);
      }
      await SubjectModel.findByIdAndUpdate(doc?.subject, { $inc: { lessonCount: -1 } })

      const result = await LessonModel.findByIdAndDelete(req.params.id);

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
      const lesson = await LessonModel.findById(req.params.id);

      if (!lesson) {
        return res.status(404).json({ message: "malumot  topilmadi" });
      }

      if (filePath && lesson.docs?.some((m) => m.path === filePath)) {
        await deleteFile(filePath);

        lesson.docs = lesson.docs.filter((m) => m.path !== filePath);

        await lesson.save();
      } else {
        await deleteFile(filePath);
        lesson.video = null;
        await lesson.save();
      }

      return res
        .status(200)
        .json({ message: "Fayl muvaffaqiyatli o'chirildi" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

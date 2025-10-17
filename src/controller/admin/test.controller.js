const TestModel = require("../../models/test.model");
const { deleteFile } = require("../../utils/deleteFile");
module.exports = {
  addNewTest: async (req, res) => {
    try {
      const options = [];

      Object.keys(req.body).forEach((key) => {
        if (key.startsWith("options[")) {
          const match = key.match(/options\[(\d+)\]\.(\w+)/);
          if (match) {
            const index = Number(match[1]);
            const field = match[2];
            if (!options[index]) options[index] = {};

            if (field === "isCorrect") {
              options[index][field] = req.body[key] === "true";
            } else {
              options[index][field] = req.body[key];
            }
          }
        }
      });

      let questionFile = null;
      req.files.forEach((file) => {
        if (file.fieldname === "file") {
          questionFile = `docs/${file.filename}`;
        }

        const match = file.fieldname.match(/options\[(\d+)\]\.file/);
        if (match) {
          const index = Number(match[1]);
          if (!options[index]) options[index] = {};
          options[index].file = `docs/${file.filename}`;
        }
      });

      const question = new TestModel({
        question: req.body.question,
        subject: req.body.subject,
        lesson: req.body.lesson,
        file: questionFile,
        options,
      });

      await question.save();

      return res.status(201).json({ success: true, message: "success" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error });
    }
  },

  //     try {
  //       const questionsData = req.body;

  //       const savedQuestions = [];

  //       for (const q of questionsData) {
  //         const question = new TestModel({
  //           question: q.question,
  //           category: q.category,
  //           file: q.file || null,
  //           options: q.options.map((opt) => ({
  //             answer: opt.answer,
  //             file: opt.file || null,
  //             isCorrect: Boolean(opt.isCorrect),
  //           })),
  //         });

  //         const saved = await question.save();
  //         savedQuestions.push(saved);
  //       }

  //       return res.status(201).json({
  //         success: true,
  //         count: savedQuestions.length,
  //         message: "All questions saved successfully",
  //         data: savedQuestions,
  //       });
  //     } catch (error) {
  //       console.error("Error while saving questions:", error);
  //       return res.status(500).json({
  //         success: false,
  //         message: error.message || "Internal server error",
  //       });
  //     }
  //   },
  getAllTest: async (req, res) => {
    try {
      const { search, subject, lesson } = req.query;
      let data = {};
      const page = parseInt(req.query?.page);
      const limit = parseInt(req.query?.limit);

      const options = {
        sort: { title: 1, createdAt: 1 },
        page: page || 1,
        limit: limit || 10,
        populate: [
          {
            path: "subject",
            select: ["title"],
          },
          {
            path: "lesson",
            select: ["title"],
          },
        ],
      };

      if (search) {
        data["question"] = {
          $regex: new RegExp(search, "i"),
        };
      }

      if (subject) {
        data["subject"] = subject;
      }

      if (lesson) {
        data["lesson"] = lesson;
      }

      let docs;

      if (limit && page) {
        docs = await TestModel.paginate(data, options);
      } else {
        docs = await TestModel.find(data)
          .populate([
            {
              path: "subject",
              select: ["title"],
            },
            {
              path: "lesson",
              select: ["title"],
            },
          ])
          .sort({ title: 1, createdAt: 1 });
      }

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  },

  getOneTest: async function (req, res) {
    try {
      const result = await TestModel.findById(req.params.id).populate([
        {
          path: "subject",
          select: ["title"],
        },
        {
          path: "lesson",
          select: ["title"],
        },
      ]);
      if (!result) {
        return res.status(404).json({ message: "Ma'lomt  topilmadi" });
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  },

  deleteOneTest: async function (req, res) {
    try {
      const question = await TestModel.findById(req.params.id);

      if (!question) {
        return res.status(404).json({ message: "Ma'luomt topilmadi" });
      }

      if (question.file) {
        deleteFile(question.file);
      }

      if (question.options && question.options.length > 0) {
        question.options.forEach((opt) => {
          if (opt.file) {
            deleteFile(opt.file);
          }
        });
      }

      const result = await TestModel.findByIdAndDelete(req.params.id);

      if (!result) {
        return res
          .status(400)
          .json({ message: "Ma'luomt o'chirishda xatolik" });
      }

      return res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);

      return res.status(400).json({ message: error });
    }
  },
};

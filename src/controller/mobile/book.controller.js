const BookModel = require("../../models/book.model");

module.exports = {
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
};

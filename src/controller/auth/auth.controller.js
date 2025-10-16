const { promisify } = require("util");
const env = process.env;
const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../../utils/error");
const UserModel = require("../../models/user.model");

const signAsync = promisify(jwt.sign);

module.exports = {
  login: async function (req, res, next) {
    const { phone, password } = req.body;
    try {
      if (phone == env?.ADMIN_PHONE && password == env?.ADMIN_PASSWORD) {
        const token = await signAsync(
          {
            _id: null,
            role: "admin",
            firstName: "Admin",
            lastName: "Admin",
            middleName: "Admin",
          },
          env?.JWT_SECRET_KEY,
          { expiresIn: env?.JWT_EXPIRESIN }
        );
        return res.status(200).json({ token });
      } else {
        return res
          .status(400)
          .json({ message: "Telefon raqam yoki parol noto'g'ri" });
      }
    } catch (err) {
      console.log(err);
      return next(new ErrorHandler(400, "Failed to login as admin"));
    }
  },

  mobileLogin: async (req, res, next) => {
    try {
      console.log(req.body);

      const { phone, password } = req.body;

      let user = await UserModel.findOne({
        phone: phone,
      });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Telefon raqam yoki parol noto'g'ri" });
      }
      if (user.password == password) {
        const token = jwt.sign(
          {
            _id: user?._id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            middleName: user?.middleName,
            role: user?.role,
          },
          process.env.JWT_SECRET_KEY,
          {
            algorithm: "HS256",
            expiresIn: process.env.JWT_MOBILE_EXPIRESIN,
          }
        );

        return res.status(200).json({ token });
      } else {
        return res
          .status(404)
          .json({ message: "Telefon raqam yoki parol noto'g'ri" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

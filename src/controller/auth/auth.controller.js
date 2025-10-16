const { promisify } = require("util");
const env = process.env;
const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../../utils/error");

const signAsync = promisify(jwt.sign);

module.exports = {
  login: async function (req, res, next) {
    const { phone, password } = req.body;
    try {
      if (phone == env?.ADMIN_PHONE && password == env?.ADMIN_PASSWORD) {
        const token = await signAsync(
          {
            _id: null,
            role: "superadmin",
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
};

const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const verifyAsync = promisify(jwt.verify);

async function authenticate(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  let statusCode = 403;
  try {
    if (!token) {
      statusCode = 401;
      throw new Error(
        `Autentifikatsiya talab qilinadi. Iltimos,  token yuboring.`
      );
    }
    const decoded = await verifyAsync(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(statusCode).json({ message: err?.message || err });
  }
}

module.exports = authenticate;

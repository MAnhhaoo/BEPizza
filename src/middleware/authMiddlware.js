const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// 🧩 Xác thực người dùng (user login hoặc admin đều được)
const authUser = (req, res, next) => {
  const authHeader = req.headers.token || req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Không có token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.ACCESS_TOKEN);

    req.user = user; // lưu lại thông tin user vào request
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};

// 🧩 Chỉ cho phép Admin truy cập
const authAdmin = (req, res, next) => {
  const authHeader = req.headers.token || req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Không có token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.ACCESS_TOKEN);

    if (user.isAdmin) {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "Không có quyền admin" });
    }
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};

module.exports = { authUser, authAdmin };

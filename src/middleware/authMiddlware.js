const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require('../models/UserModels'); 

const authUser = (req, res, next) => {
 const authHeader = req.headers.token || req.headers.authorization;

 if (!authHeader) {
  return res.status(401).json({ message: "Không có token" });
 }

 try {
  const token = authHeader.split(" ")[1];
  const user = jwt.verify(token, process.env.ACCESS_TOKEN);

  req.user = user;
  next();
 } catch (err) {
  console.error(" Lỗi AuthUser:", err);
  return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
 }
};

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
  console.error(" Lỗi AuthAdmin:", err);
  return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
 }
};

const checkBlocked = async (req, res, next) => {
  try {
    const userId = req.user?._id; 
    
    if (!userId) {
      return res.status(401).json({ message: "Không tìm thấy thông tin người dùng (Token thiếu hoặc chưa xác thực)." });
    }
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không còn tồn tại trong hệ thống." });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: 'Tài khoản của bạn đã bị khóa và không thể thực hiện thao tác đặt hàng.',
        status: 'ERR'
      });
    }
    
    next();
  } catch (error) {
    console.error(" Lỗi Middleware checkBlocked:", error.message);
    return res.status(500).json({ message: "Lỗi Server khi kiểm tra trạng thái người dùng." });
  }
};

module.exports = { authUser, authAdmin , checkBlocked};
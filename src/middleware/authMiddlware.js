const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// 💡 BỔ SUNG QUAN TRỌNG: Import User Model để có thể truy cập Database
const User = require('../models/UserModels'); // ❗ ĐẢM BẢO ĐƯỜNG DẪN CHÍNH XÁC VỚI CẤU TRÚC THƯ MỤC CỦA BẠN

// 🧩 Xác thực người dùng (user login hoặc admin đều được)
const authUser = (req, res, next) => {
 const authHeader = req.headers.token || req.headers.authorization;

 if (!authHeader) {
  return res.status(401).json({ message: "Không có token" });
 }

 try {
  const token = authHeader.split(" ")[1];
  const user = jwt.verify(token, process.env.ACCESS_TOKEN);

  req.user = user; // lưu lại thông tin user vào request (chứa _id)
  next();
 } catch (err) {
  console.error("❌ Lỗi AuthUser:", err);
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
  console.error("❌ Lỗi AuthAdmin:", err);
  return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
 }
};

// 🔒 Middleware kiểm tra trạng thái Khóa (Block)
const checkBlocked = async (req, res, next) => {
  try {
    // Lấy ID người dùng từ payload đã được gán bởi authUser
    const userId = req.user?._id; 
    
    if (!userId) {
      return res.status(401).json({ message: "Không tìm thấy thông tin người dùng (Token thiếu hoặc chưa xác thực)." });
    }
    
    // Tìm người dùng trong DB
    const user = await User.findById(userId);

    // Xử lý trường hợp người dùng không tồn tại (đã bị xóa)
    if (!user) {
      return res.status(404).json({ message: "Người dùng không còn tồn tại trong hệ thống." });
    }

    // 🛑 KIỂM TRA TRẠNG THÁI KHÓA
    if (user.isBlocked) {
      return res.status(403).json({
        message: 'Tài khoản của bạn đã bị khóa và không thể thực hiện thao tác đặt hàng.',
        status: 'ERR'
      });
    }
    
    // Nếu không bị khóa, cho phép đi tiếp
    next();
  } catch (error) {
    // ⚠️ Log lỗi chi tiết để dễ debug hơn
    console.error("❌ Lỗi Middleware checkBlocked:", error.message);
    return res.status(500).json({ message: "Lỗi Server khi kiểm tra trạng thái người dùng." });
  }
};

module.exports = { authUser, authAdmin , checkBlocked};
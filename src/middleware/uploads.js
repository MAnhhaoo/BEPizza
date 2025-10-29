const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Cần thiết để kiểm tra/tạo thư mục

// 1. Xác định đường dẫn tuyệt đối đến thư mục 'uploads'
// process.cwd() trả về đường dẫn thư mục mà bạn đang chạy lệnh node/npm từ đó (thường là thư mục gốc của dự án).
const uploadDir = path.join(process.cwd(), 'uploads');

// 2. Đảm bảo thư mục 'uploads' tồn tại
if (!fs.existsSync(uploadDir)) {
    // Nếu chưa có, tạo thư mục
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. Cấu hình nơi lưu ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Luôn sử dụng đường dẫn tuyệt đối đã được xác nhận/tạo
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        // Đổi tên file để tránh trùng lặp
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});

const upload = multer({ storage });

module.exports = upload;
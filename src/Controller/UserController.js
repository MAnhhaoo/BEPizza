const UserService = require('../Service/UserService'); // Import Service Class
// Khởi tạo instance của Service cho Controller
const userServiceInstance = new UserService(); 

// Controller
class UserController {
 
   constructor(userService) {
    this.userService = userService;
  }

    async createUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
            }

            const result = await userServiceInstance.createUser(req.body); 

            if (result.status === 'error') {
                return res.status(409).json({ message: result.message }); // 409 Conflict cho lỗi đã tồn tại
            }

            return res.status(201).json(result); // 201 Created
        } catch (error) {
            console.error("Lỗi Controller Đăng ký:", error);
            return res.status(500).json({ message: error.message || "Lỗi server" });
        }
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Vui lòng điền đầy đủ trường dữ liệu" });
            }
            
            // ✅ GỌI SERVICE
            const result = await userServiceInstance.loginUser(req.body);
            
            if (result.status === 'error') {
                return res.status(401).json({ message: result.message }); // 401 Unauthorized
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message || "Lỗi server" });
        }
    }

    async updateUser(req, res) {
        try {
            const CheckUserID = req.params.id;
            const Data = req.body;
            if (!CheckUserID) {
                return res.status(400).json({ message: "Không tìm thấy ID người dùng" });
            }
            const result = await userServiceInstance.updateUser(CheckUserID, Data);
            
            if (result.status === 'error') {
                return res.status(404).json({ message: result.message });
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message || "Lỗi server" });
        }
    }

    async getUser(req, res) {
        try {
            const getID = req.params.id;
            if (!getID) {
                return res.status(400).json({ message: "Không tìm thấy ID người dùng" });
            }
            const result = await userServiceInstance.getUser(getID);
            
            if (result.status === 'error') {
                return res.status(404).json({ message: result.message });
            }
            
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message || "Lỗi server" });
        }
    }

    async getAlluser(req, res) {
        try {
            const { search } = req.query;
            const result = await userServiceInstance.getAlluser(search);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi Controller getAlluser:", error);
            return res.status(500).json({ message: error.message || "Lỗi server" });
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            if (!userId) {
                return res.status(400).json({ message: "Không tìm thấy ID người dùng để xóa" });
            }
            const result = await userServiceInstance.deleteUser(userId);
            
            if (result.status === 'error') {
                return res.status(404).json({ message: result.message });
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message || "Lỗi server" });
        }
    }

    async updateUserStatus(req, res) {
        try {
            const userId = req.params.id;
            const { isBlocked } = req.body; 

            if (!userId || typeof isBlocked !== "boolean") {
                return res.status(400).json({ message: "Thiếu ID hoặc trạng thái isBlocked (true/false)" });
            }
            
            const result = await userServiceInstance.updateUserStatus(userId, isBlocked);
            
            if (result.status === 'error') {
                return res.status(403).json({ message: result.message }); // 403 Forbidden
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error("❌ Lỗi updateUserStatus:", error);
            return res.status(500).json({ message: error.message || "Lỗi server" });
        }
    }
}

// ✅ Export một instance của Controller
module.exports = new UserController();
const bcrypt = require('bcrypt');
const User = require('../models/UserModels'); // ✅ Phải import Model ở đây
const { Access_token } = require('./JwtService'); // ✅ Phải import JwtService

class UserService {
    // 1. Đăng ký người dùng
    async createUser(newUser) {
        const { email, password } = newUser;

        const checkMail = await User.findOne({ email });
        if (checkMail) {
            return {
                status: "error",
                message: "Email đã được sử dụng",
            };
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const createdUser = await User.create({
            email,
            password: hashedPassword,
        });

        const userData = createdUser.toObject();
        delete userData.password; 

        return {
            status: "success",
            message: "Đăng ký thành công",
            data: userData,
        };
    }

    // 2. Đăng nhập người dùng
   // ... (các đoạn code khác)

// 2. Đăng nhập người dùng
async loginUser(logindata) {
    const { email, password } = logindata;
    const user = await User.findOne({ email: email });

    if (!user) {
        return { status: "error", message: "Email không tồn tại!" };
    }

    // 🛑 BỔ SUNG: Kiểm tra trạng thái bị khóa
    if (user.isBlocked) {
        return { 
            status: "error", 
            message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên." 
        };
    }
    // 🛑 KẾT THÚC BỔ SUNG

    // LƯU Ý: bcrypt.compare là hàm async, nên dùng await
    const isPass = await bcrypt.compare(password, user.password); 
    if (!isPass) {
        return { status: "error", message: "Sai mật khẩu!" };
    }

    // ... (logic tạo access_token và trả về thành công)
    const access_token = await Access_token({
        _id: user.id,
        isAdmin: user.isAdmin
    });

    return {
        status: "success",
        message: "Đăng nhập thành công!",
        access_token: access_token,
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            // Thêm isBlocked vào response (tùy chọn)
            isBlocked: user.isBlocked 
        }
    };
}

// ... (các đoạn code khác)

    // 3. Cập nhật thông tin người dùng
    async updateUser(id, Data) {
        const CheckUser = await User.findById(id);
        if (!CheckUser) {
            return { status: "error", message: "Không tìm thấy người dùng" };
        }
        
        // Kiểm tra và mã hóa mật khẩu nếu có thay đổi
        if (Data.password) {
            Data.password = bcrypt.hashSync(Data.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, Data, { new: true });
        
        const userData = updatedUser.toObject();
        delete userData.password;

        return {
            status: "success",
            message: "Cập nhật người dùng thành công",
            data: userData
        };
    }

    // 4. Lấy thông tin người dùng bằng ID
    async getUser(id) {
        const checkUser = await User.findOne({ _id: id });
        if (!checkUser) {
            return { status: "error", message: "Không tìm thấy ID người dùng" };
        }
        return {
            status: "success",
            message: "Lấy thông tin người dùng thành công",
            data: checkUser
        };
    }

    // 5. Lấy tất cả người dùng (có tìm kiếm)
    async getAlluser(search = '') {
        let findQuery = {};
        
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            findQuery = {
                $or: [
                    { name: { $regex: searchRegex } },
                    { email: { $regex: searchRegex } },
                ]
            };
        }
        
        const checkUser = await User.find(findQuery);

        return { 
            status: "success",
            message: "Lấy tất cả người dùng thành công",
            data: checkUser
        };
    }

    // 6. Xóa người dùng
    async deleteUser(id) {
        const Ktr = await User.findById(id);
        if (!Ktr) {
            return { status: "error", message: "Không tìm thấy người dùng để xóa" };
        }
        
        // SỬA: Xóa bằng ID
        const deletedUser = await User.findByIdAndDelete(id); 

        return {
            status: "success",
            message: "Xóa người dùng thành công",
            data: deletedUser
        };
    }

    // 7. Cập nhật trạng thái Block
    async updateUserStatus(userId, isBlocked) {
        const user = await User.findById(userId);
        if (!user) {
            return { status: "error", message: "Không tìm thấy người dùng" };
        }

        // 🛑 Ngăn chặn thao tác nếu là Admin
        if (user.isAdmin) {
             return { status: "error", message: "Không thể Khóa/Mở khóa tài khoản Quản trị viên!" };
        }

        user.isBlocked = isBlocked;
        await user.save();

        return {
            status: "success",
            message: isBlocked ? "Đã khóa tài khoản người dùng" : "Đã mở khóa tài khoản người dùng",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isBlocked: user.isBlocked
            }
        };
    }
}

module.exports = UserService; // ✅ Export Class
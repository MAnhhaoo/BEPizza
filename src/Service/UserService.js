const bcrypt = require('bcrypt');
const User = require('../models/UserModels'); 
const { Access_token } = require('./JwtService'); 

class UserService {
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


async loginUser(logindata) {
    const { email, password } = logindata;
    const user = await User.findOne({ email: email });

    if (!user) {
        return { status: "error", message: "Email không tồn tại!" };
    }

    if (user.isBlocked) {
        return { 
            status: "error", 
            message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên." 
        };
    }
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


    async updateUser(id, Data) {
        const CheckUser = await User.findById(id);
        if (!CheckUser) {
            return { status: "error", message: "Không tìm thấy người dùng" };
        }
        
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

    async deleteUser(id) {
        const Ktr = await User.findById(id);
        if (!Ktr) {
            return { status: "error", message: "Không tìm thấy người dùng để xóa" };
        }
        
        const deletedUser = await User.findByIdAndDelete(id); 

        return {
            status: "success",
            message: "Xóa người dùng thành công",
            data: deletedUser
        };
    }

    async updateUserStatus(userId, isBlocked) {
        const user = await User.findById(userId);
        if (!user) {
            return { status: "error", message: "Không tìm thấy người dùng" };
        }

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
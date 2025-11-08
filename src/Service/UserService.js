const bcrypt = require('bcrypt');
const User = require('../models/UserModels');
const { Access_token } = require('./JwtService');

class UserService {
async createUser(newUser) {
  const { email, password } = newUser;

  const checkMail = await User.findOne({ email });
  if (checkMail) {
    throw new Error("Email đã được sử dụng");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const createdUser = await User.create({
    email,
    password: hashedPassword,
  });

  return {
    status: "success",
    message: "Đăng ký thành công",
    data: createdUser,
  };
}



 async loginUser(logindata) { 
  const { email, password } = logindata;
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Email không tồn tại!");
  }

  const isPass = await bcrypt.compare(password, user.password);
  if (!isPass) {
    throw new Error("Sai mật khẩu!");
  }

  const access_token = await Access_token({
    _id: user.id,
    isAdmin: user.isAdmin
  });

  // ✅ Trả về thêm thông tin user
  return {
    status: "success",
    message: "Đăng nhập thành công!",
    access_token: access_token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,       // nếu có cột name
      isAdmin: user.isAdmin,
    }
  };
}


async updateUser (id , Data) {
    const CheckUser = await User.findById(
        id
    )
    if(!CheckUser){
        return {
            message : "can not find id"
        }
    }
    const updateUser = await User.findByIdAndUpdate(id , Data , {new : true})
      const userData = updateUser.toObject();
      delete userData.password;

      return {
        status: "success",
        message: "update user success",
        data: userData
      }
}

async getUser (id) {
  const checkUser = await User.findOne({
    _id : id
  })
  if(!checkUser){
    return {
      message: "can not find id user"
    }
  }
  return {
    status :"successfully",
    message: "get user by id ok",
    data: checkUser
  }
}

  // File: UserService.js (Chức năng getAlluser - Server side)
// Cần import User model (ví dụ: import User from '../models/UserModel.js';)

async getAlluser(search = '') { // ✅ Chấp nhận tham số search
    let findQuery = {};
    
    // 🌟 LOGIC TÌM KIẾM
    if (search) {
        const searchRegex = new RegExp(search, 'i'); // Tìm kiếm không phân biệt hoa/thường
       findQuery = {
    $or: [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
    ]
};
    }
    
    // ✅ Áp dụng truy vấn tìm kiếm (findQuery có thể là {} nếu không có search)
    const checkUser = await User.find(findQuery);

    return { 
        status: "success",
        message: "ok" ,
        data: checkUser
    };
}


  async deleteUser(id){
    const Ktr = await User.findById({
      _id : id
    })
    if(!Ktr) {
      return {
        message: "can not find user"
      }
    }
    const deleteId = await User.findByIdAndDelete(Ktr)

    return {
      status : "delete user ok",
      message : "ok",
      data : deleteId
    }
  }

   async updateUserStatus(userId, isBlocked) {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "Không tìm thấy người dùng" };
    }

    user.isBlocked = isBlocked;
    await user.save();

    return {
      success: true,
      message: isBlocked ? "Đã khóa tài khoản người dùng" : "Đã mở khóa tài khoản người dùng",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isBlocked: user.isBlocked
      }
    };
  }

}

module.exports = UserService;

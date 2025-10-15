const bcrypt = require('bcrypt');
const User = require('../models/UserModels');

class UserService {
  async createUser(newUser) {
    // Kiểm tra email đã tồn tại chưa
    const { name, email, password, phone } = newUser
    const checkMail = await User.findOne({ email: email });
    if (checkMail) {
      return {
        status: 'error',
        message: 'Email đã được sử dụng',
      };
    }

    // Mã hóa password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Tạo user
    const CreatUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return {
      status: 'success',
      message: 'Tạo user thành công',
      data: CreatUser,
    };
  }


  async loginUser(logindata){
    const {email , password} = logindata
    const user = await User.findOne({
        email: email
    })
    if(!user){
        return {
            message: "don't have email"
        }
    }
    const isPass = await bcrypt.compare(password , user.password )
    if(!isPass){
        return {
            status : "error",
            message: "pass wrong"
        }
    }
    return {
        status : "success",
        message :"dang nhap thanh cong",
        
    }
  }

async updateUser (id , Data) {
    const CheckUser = await User.findOne({
        _id : id
    })
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

}

module.exports = UserService;

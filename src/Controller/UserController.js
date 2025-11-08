const { json } = require('body-parser');
const UserService = require('../Service/UserService');

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

    const result = await this.userService.createUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
}


 async loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "điền thiếu trường dữ liệu"
      });
    }

    const result = await this.userService.loginUser(req.body);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server"
    });
  }
}


  async updateUser (req, res) {
    try {
        const CheckUserID = req.params.id 
        console.log("id" , CheckUserID);
        const Data = req.body
        if(!CheckUserID){
            return res.status(400).json({
                message: "can not find id user"
            })
        }
        const result = await this.userService.updateUser(CheckUserID , Data)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({
            message: error.message || "loi server"
        })
    }
  }

  async getUser (req, res) {
    try {
      const getID = req.params.id;
      if(!getID){
        return res.status(404).json({
          message: "can not find id of user"
        })
      }
      const result = await this.userService.getUser(getID)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({
        message: error.message || "loi server"
      })
    }
  }

// File: UserController.js (Chức năng getAlluser)

async getAlluser (req, res) {
    try {
        // ✅ Lấy tham số 'search' từ query
        const { search } = req.query; 

        // ✅ Chuyển tham số search vào service
        const result = await this.userService.getAlluser(search); 
        
        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi server:", error);
        return res.status(500).json({
            message : error.message || "Lỗi server"
        });
    }
}
  
  async deleteUser(req,res){
    try {
      const Data = req.params.id
      if(!Data){
        return res.status(404).json({message: "can not finr id user"})
      }
      const result = await this.userService.deleteUser(Data)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({
        message: error.message|| "loi server"
      })
    }
  }


  
async updateUserStatus(req, res) {
  try {
    const userId = req.params.id;
    const { isBlocked } = req.body; // true = khóa, false = mở

    if (!userId) {
      return res.status(400).json({ message: "Thiếu ID người dùng" });
    }

    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({ message: "Thiếu hoặc sai kiểu dữ liệu isBlocked (true/false)" });
    }

    const result = await this.userService.updateUserStatus(userId, isBlocked);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Lỗi updateUserStatus:", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
}

}



module.exports = new UserController(new (require('../Service/UserService'))());

const { json } = require('body-parser');
const UserService = require('../Service/UserService');

// Controller
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async createUser(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'điền không đầy đủ' });
      }

      const result = await this.userService.createUser(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Lỗi server' });
    }
  }

  async loginUser (req,res) {
    try {
        const {email , password } = req.body
        if(!email || !password){
            return res.status(400).json({
                message : "điền thiếu trường dữ liệu"
            })
        }

        const result = await this.userService.loginUser(req.body)
        return res.status(200).json(
            result
        )
        
    } catch (error) {
        return res.status(500).json({
            message : error.message || "Lỗi server"
        })
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

  async getAlluser (req, res) {
    try {
      const result = await this.userService.getAlluser()
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500),json({
        message : error.message || "loi server"
      })
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

}

module.exports = new UserController(new (require('../Service/UserService'))());

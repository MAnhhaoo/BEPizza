const OrderService = require("../Service/OrderService");

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  // 🟢 Tạo đơn hàng
// 🟢 Tạo đơn hàng
// File: backend/Controller/OrderController.js

async createOrder(req, res) {
    try {
        const userId = req.user ? req.user._id : req.body.user || null;
        
        // KIỂM TRA CHẶT CHẼ USERID
        if (!userId) {
            return res.status(401).json({ 
                status: 401, 
                message: "Lỗi xác thực: Vui lòng đăng nhập hoặc token đã hết hạn." 
            });
        }
        
        const result = await this.orderService.createOrder(req.body, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi Controller tạo đơn hàng:", error);
        return res.status(500).json({ message: "Lỗi server nội bộ" });
    }
}

  // 🔵 Lấy danh sách đơn hàng
  async getAllOrders(req, res) {
    try {
      const result = await this.orderService.getAllOrders();
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  // 🟡 Cập nhật trạng thái đơn hàng
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await this.orderService.updateOrderStatus(id, status);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  // 🔴 Xóa đơn hàng
  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const result = await this.orderService.deleteOrder(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }


  async getDeatilOrder (req, res )  {
    try {
      const {id} = req.params
      const result = await this.orderService.getDeatilOrder(id);
      return res.status(result.status).json(result)
    } catch (error) {
    console.log(error)
    return res.status(500).json({
      message : "Lỗi server "
    })
    }
  }

}

module.exports = new OrderController(new OrderService());

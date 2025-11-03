const Order = require("../models/OrderModel");

class OrderService {
  // 🟢 Tạo đơn hàng
  async createOrder(data, userId) {
    try {
      // 🟢 DÒNG CODE NÀY PHẢI ĐẶT TRONG KHỐI TRY VÀ SỬ DỤNG data ĐƯỢC TRUYỀN VÀO
      const {
        orderItems, // KHAI BÁO BIẾN orderItems RÕ RÀNG
        shippingAddress,
        itemPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      } = data;

      if (!orderItems || orderItems.length === 0) {
        return { status: 400, message: "Không có sản phẩm trong đơn hàng" };
      }
      
      // Kiểm tra userId (dù Controller đã kiểm tra, thêm vào đây cho chắc chắn hơn)
      if (!userId) {
          return { status: 401, message: "Lỗi hệ thống: Thiếu ID người dùng." };
      }

      const order = new Order({
        orderItems,
        shippingAddress,
        itemPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: userId, // Gán userId từ token
      });

      const createdOrder = await order.save();
      return { status: 201, message: "Tạo đơn hàng thành công", data: createdOrder };
      
    } catch (error) {
      console.error("LỖI KHI LƯU ĐƠN HÀNG (MongoDB):", error); 
        
      // 👉 Xử lý lỗi chi tiết từ MongoDB
      if (error.name === 'ValidationError') {
          return { status: 400, message: `Lỗi dữ liệu: Thiếu thông tin bắt buộc hoặc sai định dạng. Chi tiết: ${error.message}` };
      }
      if (error.name === 'CastError') {
          return { status: 400, message: "Lỗi dữ liệu: ID sản phẩm hoặc ID người dùng không hợp lệ (CastError)." };
      }

      // Trả về lỗi 500 nếu là lỗi khác
      return { status: 500, message: "Lỗi máy chủ nội bộ không xác định." };
    }
  }

  // 🔵 Lấy tất cả đơn hàng
  async getAllOrders() {
    try {
      const orders = await Order.find().populate("user", "name email");
      return { status: 200, data: orders };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Không thể lấy danh sách đơn hàng" };
    }
  }

  // 🟡 Cập nhật trạng thái đơn hàng
  async updateOrderStatus(id, status) {
    try {
      const validStatuses = ["Chờ xác nhận", "Đã xác nhận", "Đang giao", "Giao thành công" , "Giao thất bại" , "Hủy đơn"];
      if (!validStatuses.includes(status)) {
        return { status: 400, message: "Trạng thái không hợp lệ" };
      }

      const order = await Order.findById(id);
      if (!order) return { status: 404, message: "Không tìm thấy đơn hàng" };

      order.status = status;
      await order.save();

      return { status: 200, message: "Cập nhật trạng thái đơn hàng thành công", data: order };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Lỗi khi cập nhật đơn hàng" };
    }
  }

  // 🔴 Xóa đơn hàng
  async deleteOrder(id) {
    try {
      const deleted = await Order.findByIdAndDelete(id);
      if (!deleted) return { status: 404, message: "Không tìm thấy đơn hàng" };
      return { status: 200, message: "Xóa đơn hàng thành công" };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Lỗi khi xóa đơn hàng" };
    }
  }

 async getDeatilOrder(id) {
    try {
      const order = await Order.findById(id)
        .populate("user", "name email")
        .populate("orderItems.product", "name price image");

      if (!order) {
        return { status: 404, message: "Không tìm thấy đơn hàng" };
      }

      return {
        status: 200,
        message: "Lấy chi tiết đơn hàng thành công",
        data: order,
      };
    } catch (error) {
      console.error("❌ Lỗi khi xem chi tiết đơn hàng:", error);
      return { status: 500, message: "Lỗi khi xem chi tiết đơn hàng" };
    }
  }
}

module.exports = OrderService;
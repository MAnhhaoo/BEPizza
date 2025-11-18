const OrderService = require("../Service/OrderService");

class OrderController {
   
    constructor(orderService = new OrderService()) {
        this.orderService = orderService;
    }

    async createOrder(req, res) {
        try {
            // Lấy userId từ req.user (do middleware xác thực cung cấp)
            const userId = req.user?._id; 
            
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

    async getAllOrders(req, res) {
        try {
            const result = await this.orderService.getAllOrders();
            return res.status(result.status).json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // 1. Lấy Socket.io instance từ Express App
            // Cần đảm bảo bạn đã thiết lập io bằng cách: app.set('io', io); trong server.js
            // ⭐ Đã thay đổi tên key nếu bạn dùng 'io' thay vì 'socketio' như trong ví dụ server trước
            const io = req.app && req.app.get('io'); 

            // Kiểm tra io: Nếu io không tồn tại, bạn vẫn xử lý cập nhật DB, 
            // nhưng không gửi thông báo real-time.
            if (!io) {
                 console.warn("⚠️ Cảnh báo: Không tìm thấy Socket.io instance. Chỉ cập nhật DB.");
            }

            // 2. TRUYỀN io VÀO SERVICE để Service xử lý logic gửi thông báo
            const result = await this.orderService.updateOrderStatus(id, status, io);

            // 3. Trả về kết quả HTTP
            return res.status(result.status).json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }

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


    async getDeatilOrder (req, res ) {
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

    async getOrdersByUserId(req, res) {
        try {
            // userId được lấy từ req.user (do middleware authUser cung cấp)
            const userId = req.user?._id; 

            if (!userId) {
                return res.status(401).json({
                    status: 401,
                    message: "Lỗi xác thực: Vui lòng đăng nhập hoặc token đã hết hạn."
                });
            }

            const result = await this.orderService.getOrdersByUserId(userId);
            return res.status(result.status).json(result);
        } catch (error) {
            console.error("Lỗi Controller lấy đơn hàng theo ID:", error);
            return res.status(500).json({ message: "Lỗi server nội bộ" });
        }
    }


async createReview(req, res) {
        try {
            const userId = req.user?._id; 
            
            if (!userId) {
                return res.status(401).json({ 
                    status: 401, 
                    message: "Lỗi xác thực: Vui lòng đăng nhập hoặc token đã hết hạn." 
                });
            }

            const { orderId, productId, rating, comment } = req.body;

            // Kiểm tra dữ liệu input
            if (!orderId || !productId || !rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
                return res.status(400).json({ 
                    status: 400, 
                    message: "Thiếu thông tin đánh giá bắt buộc (orderId, productId, rating 1-5)." 
                });
            }

            const result = await this.orderService.createReview({
                orderId,
                productId,
                userId,
                rating,
                comment: comment || ""
            });

            return res.status(result.status).json(result);
        } catch (error) {
            console.error("Lỗi Controller tạo đánh giá:", error);
            return res.status(500).json({ message: "Lỗi server nội bộ" });
        }
    }


}


// ⭐ Tối ưu hóa: Khởi tạo OrderService và OrderController một lần
// Thay vì truyền new OrderService() vào constructor, ta đã khởi tạo nó bên trong.
module.exports = new OrderController();
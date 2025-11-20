const Order = require("../models/OrderModel");
const Review = require("../models/ReviewModel");

class OrderService {

    async getOrdersByUserId(userId) {
        try {
            if (!userId) {
                return { status: 400, message: "Thiếu ID người dùng." };
            }

            const orders = await Order.find({ user: userId })
                .populate("user", "name email")
                .sort({ createdAt: -1 });

            return { status: 200, data: orders };
        } catch (error) {
            console.error("LỖI KHI LẤY ĐƠN HÀNG THEO ID NGƯỜI DÙNG:", error);
            return { status: 500, message: "Lỗi máy chủ nội bộ không xác định." };
        }
    }

    async createOrder(data, userId) {
        try {
            const {
                orderItems,
                shippingAddress,
                itemPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                paymentMethod,
            } = data;

            if (!orderItems || orderItems.length === 0) {
                return { status: 400, message: "Không có sản phẩm trong đơn hàng" };
            }
            
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
                paymentMethod,
                user: userId,
            });

            const createdOrder = await order.save();
            return { status: 201, message: "Tạo đơn hàng thành công", data: createdOrder };
            
        } catch (error) {
            console.error("LỖI KHI LƯU ĐƠN HÀNG (MongoDB):", error);
            if (error.name === 'ValidationError') {
                return { status: 400, message: `Lỗi dữ liệu: Thiếu thông tin bắt buộc hoặc sai định dạng. Chi tiết: ${error.message}` };
            }
            if (error.name === 'CastError') {
                return { status: 400, message: "Lỗi dữ liệu: ID sản phẩm hoặc ID người dùng không hợp lệ (CastError)." };
            }

            return { status: 500, message: "Lỗi máy chủ nội bộ không xác định." };
        }
    }

    async getAllOrders() {
        try {
            const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
            return { status: 200, data: orders };
        } catch (error) {
            console.error(error);
            return { status: 500, message: "Không thể lấy danh sách đơn hàng" };
        }
    }


   async updateOrderStatus(id, status, io) {
    try {
        const validStatuses = ["Chờ xác nhận", "Đã xác nhận", "Đang giao", "Giao thành công", "Giao thất bại", "Hủy đơn"];
        if (!validStatuses.includes(status)) {
            return { status: 400, message: "Trạng thái không hợp lệ" };
        }

        // ⭐ THÊM: Kiểm tra trạng thái final - không cho update
        const finalStatuses = ["Giao thành công", "Giao thất bại", "Hủy đơn"];
        const order = await Order.findById(id).populate("user", "_id");
        if (!order) return { status: 404, message: "Không tìm thấy đơn hàng" };
        
        if (finalStatuses.includes(order.status)) {
            return { 
                status: 400, 
                message: `Không thể cập nhật đơn hàng ở trạng thái "${order.status}". Đơn hàng đã hoàn tất!` 
            };
        }

        // 1. Cập nhật trạng thái và lưu DB
        order.status = status;
        await order.save();

        // 2. 📢 Gửi thông báo Socket.io
        if (io && order.user && order.user._id) {
            const customerId = order.user._id.toString();
            const notificationData = {
                orderId: order._id.toString(),
                userId: customerId,
                status: status,
                message: `Đơn hàng của bạn đã được cập nhật thành: ${status}`
            };
            io.to(`customer_${customerId}`).emit('customerNotify', notificationData);
            console.log(`[Socket.io] Đã gửi thông báo đến ROOM ID: ${customerId}. Đơn hàng ${order._id} cập nhật thành: ${status}.`);
        }

        return { status: 200, message: "Cập nhật trạng thái đơn hàng thành công", data: order };
    } catch (error) {
        console.error("LỖI KHI CẬP NHẬT ĐƠN HÀNG:", error);
        return { status: 500, message: "Lỗi khi cập nhật đơn hàng" };
    }
}

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
            console.error(" Lỗi khi xem chi tiết đơn hàng:", error);
            return { status: 500, message: "Lỗi khi xem chi tiết đơn hàng" };
        }
    }

    async createReview({ orderId, productId, userId, rating, comment }) {
        try {
            const order = await Order.findById(orderId).select('status orderItems user');
            
            if (!order) {
                return { status: 404, message: "Không tìm thấy đơn hàng." };
            }
            if (order.status !== "Giao thành công") {
                return { status: 400, message: "Chỉ có thể đánh giá đơn hàng đã 'Giao thành công'." };
            }
            if (order.user.toString() !== userId.toString()) {
                return { status: 403, message: "Bạn không có quyền đánh giá đơn hàng này." };
            }

            const itemIndex = order.orderItems.findIndex(item => item.product.toString() === productId.toString());

            if (itemIndex === -1) {
                return { status: 404, message: "Sản phẩm không thuộc đơn hàng này." };
            }
            if (order.orderItems[itemIndex].isReviewed) {
                return { status: 400, message: "Sản phẩm này đã được đánh giá cho đơn hàng này rồi." };
            }
            
            const review = new Review({
                user: userId,
                product: productId,
                order: orderId,
                rating: rating,
                comment: comment,
            });

            await review.save();

            order.orderItems[itemIndex].isReviewed = true;
            await order.save();
            
            
            return { 
                status: 201, 
                message: "Đánh giá sản phẩm thành công.", 
                data: review 
            };
        } catch (error) {
            console.error("LỖI KHI TẠO ĐÁNH GIÁ:", error);
            if (error.code === 11000) { // Duplicate key error (đã đánh giá rồi theo index)
                 return { status: 400, message: "Sản phẩm đã được đánh giá cho đơn hàng này." };
            }
            return { status: 500, message: "Lỗi máy chủ nội bộ không xác định." };
        }
    }
}

module.exports = OrderService;
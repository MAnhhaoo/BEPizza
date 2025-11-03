const express = require("express");
const router = express.Router();
const orderController = require("../Controller/OrderController");
const { authUser } = require("../middleware/authMiddlware");

// 🟢 Người dùng đăng nhập mới được tạo đơn hàng
router.post("/create", authUser, (req, res) => orderController.createOrder(req, res));

// 🔵 Admin mới được xem tất cả đơn hàng
router.get("/getAll",  (req, res) => orderController.getAllOrders(req, res));

// 🟡 Admin cập nhật trạng thái đơn hàng
router.put("/updateStatus/:id", (req, res) => orderController.updateOrderStatus(req, res));

// 🔴 Admin xóa đơn hàng
router.delete("/delete/:id", (req, res) => orderController.deleteOrder(req, res));

router.get("/getDetailOrder/:id", (req, res) => orderController.getDeatilOrder(req, res));


module.exports = router;

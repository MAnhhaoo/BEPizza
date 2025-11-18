const express = require("express");
const router = express.Router();
const orderController = require("../Controller/OrderController");
const { authUser , checkBlocked } = require("../middleware/authMiddlware");

router.post("/create",  authUser,checkBlocked, (req, res) => orderController.createOrder(req, res));

router.get("/getAll",  (req, res) => orderController.getAllOrders(req, res));

router.put("/updateStatus/:id", (req, res) => orderController.updateOrderStatus(req, res));

router.delete("/delete/:id", (req, res) => orderController.deleteOrder(req, res));

router.get("/getDetailOrder/:id", (req, res) => orderController.getDeatilOrder(req, res));

router.get("/getMyOrders", authUser, (req, res) => orderController.getOrdersByUserId(req, res)); 

router.post("/review", authUser, checkBlocked, (req, res) => orderController.createReview(req, res));

module.exports = router;

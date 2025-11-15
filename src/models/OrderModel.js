// File: backend/models/OrderModel.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  shippingAddress: {
    fullName: { type: String, required: true }, // 🟢 THÊM TÊN NGƯỜI NHẬN
    phone: { type: String, required: true }, // 🟢 THÊM SĐT
    address: { type: String, required: true }, // Địa chỉ đầy đủ
    city: { type: String, required: true }, // Tỉnh/Thành phố
    postalCode: { type: String },
    country: { type: String, default: "Việt Nam" },
  },
  itemPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  
  paymentMethod: { type: String, enum: ["COD", "Bank Transfer"], default: "COD" }, // 🟢 THÊM PHƯƠNG THỨC TT

  status: {
    type: String,
    enum: ["Chờ xác nhận", "Đã xác nhận", "Đang giao", "Giao thành công" , "Giao thất bại" , "Hủy đơn"],
    default: "Chờ xác nhận",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, 
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
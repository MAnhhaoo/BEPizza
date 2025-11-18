const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    // ID của người dùng thực hiện đánh giá
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
    // ID của sản phẩm được đánh giá
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    
    // ID của đơn hàng mà sản phẩm được mua (đảm bảo đánh giá hợp lệ)
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    
    // Điểm đánh giá (số sao)
    rating: {
        type: Number,
        required: true,
        min: 1, // Tối thiểu 1 sao
        max: 5, // Tối đa 5 sao
    },
    
    // Nội dung bình luận (tùy chọn)
    comment: {
        type: String,
        required: false, 
        default: "",
        trim: true,
    },
}, { timestamps: true });

// --- Indexing quan trọng ---
// Đảm bảo rằng một người dùng (user) chỉ có thể đánh giá một sản phẩm (product)
// duy nhất trên một đơn hàng (order) một lần.
reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 }, 
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
      required: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
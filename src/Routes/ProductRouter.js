const express = require('express');
const router = express.Router();
const ProductController = require ("../Controller/ProductController");

router.post("/creatProduct" , ProductController.createProduct.bind(ProductController))
router.get("/getAllProduct" , ProductController.getAllProduct.bind(ProductController))
router.get ("/getProduct/:id" , ProductController.getProductbyId.bind(ProductController))
router.delete("/deleteProduct/:id" , ProductController.deleteProduct.bind(ProductController))
router.put("/updateProduct/:id" , ProductController.updateProduct.bind(ProductController))

module.exports = router
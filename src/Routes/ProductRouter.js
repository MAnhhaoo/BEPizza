const express = require("express");
const upload = require("../middleware/uploads");
const router = express.Router();

const ProductController = require("../Controller/ProductController");
const CategoryController = require("../Controller/CategoryController");

// PRODUCT
router.post("/creatProduct", upload.single("image"), ProductController.createProduct.bind(ProductController));
router.get("/getAllProduct", ProductController.getAllProduct.bind(ProductController));
router.get("/getAllTypes", ProductController.getAllTypes.bind(ProductController));
router.get("/getProduct/:id", ProductController.getProductbyId.bind(ProductController));
router.delete("/deleteProduct/:id", ProductController.deleteProduct.bind(ProductController));
router.put("/updateProduct/:id", upload.single("image"), ProductController.updateProduct.bind(ProductController));

// CATEGORY
router.get("/getAllCategory", CategoryController.getAllCategory.bind(CategoryController));
router.post("/createCategory", CategoryController.createCategory.bind(CategoryController));
router.put("/updateCategory/:id", CategoryController.updateCategory.bind(CategoryController));
router.delete("/deleteCategory/:id", CategoryController.deleteCategory.bind(CategoryController));

module.exports = router;

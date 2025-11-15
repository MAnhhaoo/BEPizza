const ProductService = require("../Service/ProductService")
const upload = require("../middleware/uploads");

class ProductController {
    constructor(ProductService){
        this.ProductService = ProductService
    }

    // File: ProductController.js (Chức năng getAllProduct)
    async getAllProduct (req, res) {
        try {
            // ✅ Bổ sung 'type' vào danh sách trích xuất từ req.query
            let { limit, page, sort, filter, name, type } = req.query; 

            // Gán giá trị mặc định nếu không truyền
            limit = Number(limit) || 10;
            page = Number(page) || 0;

            // 👉 Parse sort và filter nếu có
            if (filter) {
                try {
                    filter = JSON.parse(filter);
                } catch (e) {
                    filter = null;
                }
            }
            
            if (sort) {
                try {
                    sort = JSON.parse(sort);
                } catch (e) {
                    sort = null;
                }
            }
            
            // 🌟 LOGIC MỚI: Ưu tiên lọc theo Type HOẶC Name và chuẩn bị filter cho Service
            if (type) {
                filter = ["type", type]; // Lọc theo Type
            } else if (name) {
                filter = ["name", name]; // Tìm kiếm theo Name
            }
            
            const result = await this.ProductService.getAllProduct(limit, page, sort, filter);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi server:", error);
            return res.status(500).json({
                message: error.message || "Lỗi server"
            });
        }
    }


    async createProduct(req, res) {
        try {
            const { name, type, price, description , rating } = req.body;
            
            const image = req.file ? `/uploads/${req.file.filename}` : null;

            if (!name || !type || !price || !image) {
                return res.status(400).json({
                    message: "Thiếu một số trường bắt buộc (name, type, price, image)",
                });
            }

            const result = await this.ProductService.createProduct({
                name,
                type,
                price,
                image,
                description, 
                rating: Number(rating) || 0, 
            });

            return res.status(200).json({
                message: "Tạo sản phẩm thành công",
                data: result,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message || "Lỗi server",
            });
        }
    }


    async getAllTypes(req, res) {
        try {
            const result = await this.ProductService.getAllTypes();
            return res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi server khi lấy types:", error);
            return res.status(500).json({
                message: error.message || "Lỗi server"
            });
        }
    }

    async getProductbyId (req , res) {
        try {
            const Data = req.params.id
            if(!Data) {
                return res.status(404).json({
                    message: "can not find product"
                })
            }
            const result = await this.ProductService.getProductbyId(Data)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json({
                message : error.message || "loi server"
            })
        }
    }

    async deleteProduct (req, res){
        try {
            const ID = req.params.id
            if(!ID){
                return res.status(404).json({message: "can not find ID product"})
            }
            const result = await this.ProductService.deleteProduct(ID)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json({
                message : error.message || "loi server"
            })
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const { name, type, price, description , rating } = req.body; 
            const newImagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

            if (!productId) {
                return res.status(404).json({
                    message: "Không tìm thấy ID sản phẩm (can not find id product)"
                });
            }
            
            const updateData = { 
                name, 
                type, 
                price, 
                description,
                rating: Number(rating) || undefined
            };

            if (newImagePath) {
                updateData.image = newImagePath;
            }

            const result = await this.ProductService.updateProduct(productId, updateData);
            
            return res.status(200).json({
                message: "Cập nhật sản phẩm thành công",
                data: result,
            });

        } catch (error) {
            return res.status(500).json({
                message: error.message || "Lỗi server"
            });
        }
    }
}

module.exports = new ProductController( new (require('../Service/ProductService'))())
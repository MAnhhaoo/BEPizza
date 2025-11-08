const ProductService = require("../Service/ProductService")
const upload = require("../middleware/uploads");
class ProductController {
    constructor(ProductService){
        this.ProductService=ProductService
    }
// File: ProductController.js (Chức năng getAllProduct)

async getAllProduct (req, res) {
    try {
        // Lấy tất cả các query parameters, bao gồm name
        let { limit, page, sort, filter, name } = req.query; // ✅ THÊM name

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
        
        // 🌟 XỬ LÝ TÌM KIẾM THEO TÊN: Gán name vào filter để Service xử lý
        if (name) {
            // Định dạng filter thành [label, value]
            filter = ["name", name]; 
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
    // 🌟 SỬA LỖI: Thêm 'description' vào danh sách trích xuất từ req.body
    const { name, type, price, description } = req.body;
    
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Kiểm tra thiếu trường bắt buộc
    // Lưu ý: description không bắt buộc theo schema bạn cung cấp, 
    // nên ta chỉ kiểm tra các trường bắt buộc khác.
    if (!name || !type || !price || !image) {
      return res.status(400).json({
        message: "Thiếu một số trường bắt buộc (name, type, price, image)",
      });
    }

    // Tạo sản phẩm
    const result = await this.ProductService.createProduct({
      name,
      type,
      price,
      image,
      // 🌟 SỬA LỖI: Truyền description vào Service
      description, 
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


// ProductController.js (hoặc nơi chứa các hàm Controller khác)

// ... các hàm createProduct, getAllProduct ...

async getAllTypes(req, res) {
    try {
        // Gọi Service để lấy danh sách các type duy nhất
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
        
        // 1. Trích xuất tất cả các trường text, bao gồm description, từ req.body
        // req.body chứa các trường text khi dùng multer
        const { name, type, price, description } = req.body; 
        
        // 2. Lấy đường dẫn ảnh mới từ req.file (chỉ tồn tại nếu có file mới được upload)
        // Nếu không có file mới, image sẽ là undefined hoặc null (tùy cách multer setup),
        // nhưng ta chỉ cần đường dẫn nếu có file mới
        const newImagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

        if (!productId) {
            return res.status(404).json({
                message: "Không tìm thấy ID sản phẩm (can not find id product)"
            });
        }
        
        // 3. Tạo đối tượng dữ liệu chỉ chứa các trường cần cập nhật
        const updateData = { 
            name, 
            type, 
            price, 
            description, // <--- TRƯỜNG MÔ TẢ ĐÃ CÓ MẶT
        };

        // 4. Chỉ thêm trường 'image' nếu có ảnh mới được upload
        if (newImagePath) {
            updateData.image = newImagePath;
        }

        // 5. Gọi Service với dữ liệu cập nhật đã chuẩn bị
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
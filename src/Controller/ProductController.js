const ProductService = require("../Service/ProductService")
class ProductController {
    constructor(ProductService){
        this.ProductService=ProductService
    }
async getAllProduct (req, res) {
  try {
    let { limit, page, sort, filter } = req.query;

    // 👉 Gán giá trị mặc định nếu không truyền
    limit = Number(limit) || 10;
    page = Number(page) || 0;

    // 👉 Parse sort và filter nếu có (vì khi gửi query từ FE nó sẽ là string)
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

    const result = await this.ProductService.getAllProduct(limit, page, sort, filter);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({
      message: error.message || "Lỗi server"
    });
  }
}


    async createProduct (req ,res) {
        try {
            const {name , image , type , price } = req.body ;
            if(!name || !image || !type || !price){
                return res.status(404).json({
                    message : "thiếu 1 số trường "
                })
            }
            const result = await this.ProductService.createProduct(req.body)
            return res.status(200).json(result)
            
        } catch (error) {
            return res.status(500).json({
                message: error.message || "loi server"
            })
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

    async updateProduct (req, res){
        try {
            const Data = req.params.id
            console.log("data" , Data)
            const info = req.body
            console.log("info",info)
            if(!Data){
                return res.status(404).json({
                    message : "can not find id product"
                })
            }
            const result = await this.ProductService.updateProduct(Data , info)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json({
                message: error.message || "loi server"
            })
        }
    }
}

module.exports = new ProductController( new (require('../Service/ProductService'))())
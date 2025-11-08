const Product = require("../models/ProductModel")
class ProductService {
  
// File: ProductService.js (Chức năng getAllProduct - Server side)
// Cần import Product model (ví dụ: import Product from '../models/ProductModel.js';)

async getAllProduct(limit, page, sort, filter) {
    
    let findQuery = {}; // Khởi tạo object tìm kiếm MongoDB

    // ✅ XỬ LÝ FILTER & TÌM KIẾM THEO TÊN
    if (filter && Array.isArray(filter) && filter.length === 2) {
        const [label, value] = filter;

        // Nếu label là 'name', sử dụng $regex để tìm kiếm không phân biệt chữ hoa/thường
        if (label === 'name') {
            findQuery = {
                [label]: { $regex: value, $options: "i" }
            };
        } else {
            // Xử lý các filter khác (ví dụ: type, price)
            findQuery = {
                [label]: value
            };
        }
    }
    
    // Đếm tổng số sản phẩm THỰC TẾ sau khi áp dụng filter/tìm kiếm để phân trang
    const totalFilteredProduct = await Product.countDocuments(findQuery);

    let checkProduct = Product.find(findQuery);
    
    // ✅ Áp dụng Sort (nếu có)
    if (sort && Array.isArray(sort) && sort.length === 2) {
        const objectSort = {};
        objectSort[sort[0]] = sort[1];
        checkProduct = checkProduct.sort(objectSort);
    }
    
    // Áp dụng limit và skip
    checkProduct = checkProduct
        .limit(limit)
        .skip(page * limit);

    const data = await checkProduct;

    return {
        message: "ok",
        data: data,
        total: totalFilteredProduct, // Tổng số sản phẩm sau khi tìm kiếm/filter
        page: page + 1,
        totalPage: Math.ceil(totalFilteredProduct / limit),
    };
}
async createProduct(newProduct) {
 // 🌟 BƯỚC 1: Thêm 'description' vào danh sách trích xuất từ object newProduct
 const { name, image, type, price, description } = newProduct; 

 // Lưu ý: description không bắt buộc trong Schema của bạn, nên ta không cần check ở if(!...)

 // Kiểm tra các trường BẮT BUỘC
 if (!name || !image || !type || !price) {
  return {
   status: 400,
   message: "Thiếu một số trường bắt buộc (name, image, type, price)",
  };
 }

 const checkProduct = await Product.findOne({ name });
 if (checkProduct) {
  return {
   status: 400,
   message: "Sản phẩm đã tồn tại",
  };
 }

 // 🌟 BƯỚC 2: Thêm 'description' vào đối tượng khi tạo trong database
 const addProduct = await Product.create({ 
  name, 
  image, 
  type, 
  price,
  description, // <--- THÊM description VÀO ĐÂY
 });

 return {
  status: 200,
  message: "Tạo sản phẩm thành công",
  data: addProduct,
 };
}

// ProductService (Backend) - Nơi chứa các hàm tương tác với Product Model
// ...
async getAllTypes() {
    // SỬ DỤNG AGGREGATION để lấy tất cả các giá trị duy nhất (distinct) của trường 'type'
    const uniqueTypes = await Product.distinct('type'); 
    
    // uniqueTypes sẽ là mảng: ['Pizza', 'Drink', 'Appetizer', ...]
    // Trả về định dạng mà frontend mong đợi
    const mappedData = uniqueTypes.map(type => ({ name: type })); 

    return {
        message: "ok",
        // Trả về mảng các object có trường 'name' để Frontend dễ xử lý
        data: mappedData, 
    };
}
// ...

 async getProductbyId(id) {
  const checkProduct = await Product.findById(id); // ✅ chỉ truyền id, không phải object
  if (!checkProduct) {
    return {
      status: 404,
      message: "Không tìm thấy sản phẩm",
    };
  }

  return {
    message: "ok",
    data: checkProduct,
  };
}

    async deleteProduct (id) {
        const checkID = await Product.findById({
            _id : id
        })
        if (!checkID) {
            return {
                message: "can not find id product"
            }
        }
        const deleteProductbyId = await Product.findByIdAndDelete(checkID)
        return {
            message: "ok",
            data : deleteProductbyId
        }
    }

    async updateProduct (id , info){
        const checkID = await Product.findById(id)
        if(!checkID){
            return {
                status : 404,
                message: "can not finh id product"
            }
        }
        const updateProductbyId = await Product.findByIdAndUpdate(id ,info , {new :true})
        
        return {
            status : 200,
            message: "ok",
            data :updateProductbyId
            
        }
    

    }

}
module.exports = ProductService
const Product = require("../models/ProductModel"); 
const Category = require("../models/CategoryModel"); // ✅ IMPORT CATEGORY MODEL

class ProductService {
  
  async getAllProduct(limit, page, sort, filter) {
    let findQuery = {}; 

    // Xử lý filter và tìm kiếm
    if (filter && Array.isArray(filter) && filter.length === 2) {
      const [label, value] = filter;

      if (label === 'name') {
        findQuery = {
          [label]: { $regex: value, $options: "i" }
        };
      } 
            // ✅ SỬA: Lọc theo TÊN danh mục, sau đó tìm ID để lọc trong Product Model
      else if (label === 'type') { 
                const categoryDoc = await Category.findOne({ name: value });
                if (categoryDoc) {
                    findQuery = { category: categoryDoc._id };
                } else {
                    // Nếu tên category không tồn tại, trả về kết quả rỗng
                    findQuery = { category: null }; 
                }
      }
      else {
        findQuery = { [label]: value };
      }
    }
    
    const totalFilteredProduct = await Product.countDocuments(findQuery);

    let checkProduct = Product.find(findQuery);
    
    // Áp dụng Sort (nếu có)
    if (sort && Array.isArray(sort) && sort.length === 2) {
      const objectSort = {};
      objectSort[sort[0]] = sort[1];
      checkProduct = checkProduct.sort(objectSort);
    }
    
    // Áp dụng limit và skip
    checkProduct = checkProduct
      .limit(limit)
      .skip(page * limit)
            .populate('category', 'name'); // ✅ POPULATE để lấy tên danh mục

    const data = await checkProduct;

    return {
      message: "ok",
      data: data,
      total: totalFilteredProduct, 
      page: page + 1,
      totalPage: Math.ceil(totalFilteredProduct / limit),
    };
  }
  
  async createProduct(newProduct) {
    const { name, image, type, price, description, rating } = newProduct; 

    if (!name || !image || !type || !price) {
            // ... (xử lý lỗi)
    }
    
    const checkProduct = await Product.findOne({ name });
        // ... (check trùng tên)

        // ✅ BƯỚC QUAN TRỌNG: TÌM CATEGORY ID DỰA TRÊN TÊN (type)
        const categoryDoc = await Category.findOne({ name: type });
        const categoryId = categoryDoc ? categoryDoc._id : null;
        
        if (!categoryId) {
            return {
                status: 400,
                message: "Không tìm thấy danh mục hợp lệ."
            };
        }

    const addProduct = await Product.create({ 
     name, 
     image, 
     category: categoryId, // ✅ LƯU ID VÀO TRƯỜNG category
     price,
     description,
     rating: Number(rating) || 0,
    });

    return {
     status: 200,
     message: "Tạo sản phẩm thành công",
     data: addProduct,
    };
  }

    async updateProduct (id , info){
    const checkID = await Product.findById(id)
    if(!checkID){
      return {
        status : 404,
        message: "can not find id product"
      }
    }
        
        // ✅ XỬ LÝ UPDATE CATEGORY: Nếu có trường 'type' (tên category)
        const updateInfo = { ...info };
        if (updateInfo.type) {
            const categoryDoc = await Category.findOne({ name: updateInfo.type });
            if (categoryDoc) {
                updateInfo.category = categoryDoc._id; // Gán ID vào trường category
            }
            delete updateInfo.type; // Loại bỏ trường 'type' vì Model không có
        }
        
    const updateProductbyId = await Product.findByIdAndUpdate(id , updateInfo , {new :true})
    
    return {
      status : 200,
      message: "ok",
      data :updateProductbyId
    }
  }
    
    async getAllTypes() {
    // Lấy tất cả tên danh mục từ Category Model
    const uniqueTypes = await Category.find({}, { name: 1, _id: 0 }); // Chỉ lấy trường name
    
    const mappedData = uniqueTypes.map(item => ({ name: item.name })); 

    return {
      message: "ok",
      data: mappedData, 
    };
  }

    // ... (Giữ nguyên các hàm còn lại: getProductbyId, deleteProduct)
    async getProductbyId(id) {
    const checkProduct = await Product.findById(id);
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
    const checkID = await Product.findById(id);
    if (!checkID) {
      return {
        message: "can not find id product"
      }
    }
    const deleteProductbyId = await Product.findByIdAndDelete(id) 
    return {
      message: "ok",
      data : deleteProductbyId
    }
  }
}

module.exports = ProductService
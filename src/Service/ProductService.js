const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");

class ProductService {
  async getAllProduct(limit = 10, page = 0, sort, filter) {
    try {
      let findQuery = {};

      if (filter && Array.isArray(filter) && filter.length === 2) {
        const [label, value] = filter;

        if (label === "name") {
          findQuery = {
            [label]: { $regex: value, $options: "i" },
          };
        } else if (label === "type") {
          // Nếu filter theo loại (tên danh mục), tìm _id của category trước
          const categoryDoc = await Category.findOne({ name: value });
          if (categoryDoc) {
            findQuery = { category: categoryDoc._id };
          } else {
            // Nếu không tìm thấy danh mục, trả về kết quả rỗng
            findQuery = { category: null };
          }
        } else {
          findQuery = { [label]: value };
        }
      }

      const totalFilteredProduct = await Product.countDocuments(findQuery);

      let query = Product.find(findQuery);

      if (sort && Array.isArray(sort) && sort.length === 2) {
        const objectSort = {};
        objectSort[sort[0]] = sort[1];
        query = query.sort(objectSort);
      }

      query = query
        .limit(limit)
        .skip(page * limit)
        .populate("category", "name description");

      const data = await query.exec();

      return {
        message: "ok",
        data,
        total: totalFilteredProduct,
        page: page + 1,
        totalPage: Math.ceil(totalFilteredProduct / limit),
      };
    } catch (err) {
      console.error("ProductService.getAllProduct error:", err);
      return {
        status: 500,
        message: "Lỗi server khi lấy danh sách sản phẩm",
        error: err.message,
      };
    }
  }

  async createProduct(newProduct) {
    try {
      const { name, image, type, price, description, rating } = newProduct;

      // Basic validation
      if (!name || !image || !type || !price) {
        return {
          status: 400,
          message: "Vui lòng cung cấp đầy đủ name, image, type và price",
        };
      }

      const existing = await Product.findOne({ name });
      if (existing) {
        return {
          status: 409,
          message: "Sản phẩm đã tồn tại",
        };
      }

      const categoryDoc = await Category.findOne({ name: type });
      const categoryId = categoryDoc ? categoryDoc._id : null;

      if (!categoryId) {
        return {
          status: 400,
          message: "Không tìm thấy danh mục hợp lệ.",
        };
      }

      const addProduct = await Product.create({
        name,
        image,
        category: categoryId,
        price,
        description,
        rating: Number(rating) || 0,
      });

      // Lấy lại và populate trước khi trả về
      const populated = await Product.findById(addProduct._id).populate(
        "category",
        "name description"
      );

      return {
        status: 200,
        message: "Tạo sản phẩm thành công",
        data: populated,
      };
    } catch (err) {
      console.error("ProductService.createProduct error:", err);
      return {
        status: 500,
        message: "Lỗi server khi tạo sản phẩm",
        error: err.message,
      };
    }
  }

  async updateProduct(id, info) {
    try {
      const checkID = await Product.findById(id);
      if (!checkID) {
        return {
          status: 404,
          message: "Không tìm thấy sản phẩm với id này",
        };
      }

      const updateInfo = { ...info };

      // Nếu frontend gửi trường type (tên danh mục), chuyển sang category _id
      if (updateInfo.type) {
        const categoryDoc = await Category.findOne({ name: updateInfo.type });
        if (categoryDoc) {
          updateInfo.category = categoryDoc._id;
        } else {
          // Nếu không tìm thấy category tương ứng, xóa field hoặc báo lỗi tùy chính sách
          delete updateInfo.type;
        }
        delete updateInfo.type;
      }

      const updated = await Product.findByIdAndUpdate(id, updateInfo, {
        new: true,
      }).populate("category", "name description");

      return {
        status: 200,
        message: "ok",
        data: updated,
      };
    } catch (err) {
      console.error("ProductService.updateProduct error:", err);
      return {
        status: 500,
        message: "Lỗi server khi cập nhật sản phẩm",
        error: err.message,
      };
    }
  }

  async getAllTypes() {
    try {
      const uniqueTypes = await Category.find({}, { name: 1, _id: 0 });
      const mappedData = uniqueTypes.map((item) => ({ name: item.name }));
      return {
        message: "ok",
        data: mappedData,
      };
    } catch (err) {
      console.error("ProductService.getAllTypes error:", err);
      return {
        status: 500,
        message: "Lỗi server khi lấy danh mục",
        error: err.message,
      };
    }
  }

  async getProductbyId(id) {
    try {
      // Populate để trả về object category
      const checkProduct = await Product.findById(id).populate(
        "category",
        "name description"
      );

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
    } catch (err) {
      console.error("ProductService.getProductbyId error:", err);
      return {
        status: 500,
        message: "Lỗi server khi lấy sản phẩm",
        error: err.message,
      };
    }
  }

  async deleteProduct(id) {
    try {
      const checkID = await Product.findById(id);
      if (!checkID) {
        return {
          status: 404,
          message: "Không tìm thấy sản phẩm",
        };
      }
      const deleteProductbyId = await Product.findByIdAndDelete(id);
      return {
        message: "ok",
        data: deleteProductbyId,
      };
    } catch (err) {
      console.error("ProductService.deleteProduct error:", err);
      return {
        status: 500,
        message: "Lỗi server khi xóa sản phẩm",
        error: err.message,
      };
    }
  }
}

module.exports = ProductService;
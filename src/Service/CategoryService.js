const Category = require("../models/CategoryModel");

class CategoryService {
  async getAllCategory() {
    const data = await Category.find();
    return { message: "ok", data };
  }

  async createCategory(newCategory) {
    const { name, description } = newCategory;
    if (!name) return { status: 400, message: "Thiếu tên danh mục" };

    const exist = await Category.findOne({ name });
    if (exist) return { status: 400, message: "Danh mục đã tồn tại" };

    const created = await Category.create({ name, description });
    return { status: 200, message: "Tạo danh mục thành công", data: created };
  }

  async updateCategory(id, info) {
    const exist = await Category.findById(id);
    if (!exist) return { status: 404, message: "Không tìm thấy danh mục" };

    const updated = await Category.findByIdAndUpdate(id, info, { new: true });
    return { status: 200, message: "Cập nhật danh mục thành công", data: updated };
  }

  async deleteCategory(id) {
    const exist = await Category.findById(id);
    if (!exist) return { status: 404, message: "Không tìm thấy danh mục" };

    await Category.findByIdAndDelete(id);
    return { status: 200, message: "Xóa danh mục thành công" };
  }
}

module.exports = CategoryService;

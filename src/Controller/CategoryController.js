const CategoryService = require("../Service/CategoryService");

class CategoryController {
  constructor(CategoryService) {
    this.CategoryService = CategoryService;
  }

  async getAllCategory(req, res) {
    try {
      const result = await this.CategoryService.getAllCategory();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message || "Lỗi server" });
    }
  }

  async createCategory(req, res) {
    try {
      const result = await this.CategoryService.createCategory(req.body);
      return res.status(result.status || 200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message || "Lỗi server" });
    }
  }

  async updateCategory(req, res) {
    try {
      const id = req.params.id;
      const result = await this.CategoryService.updateCategory(id, req.body);
      return res.status(result.status || 200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message || "Lỗi server" });
    }
  }

  async deleteCategory(req, res) {
    try {
      const id = req.params.id;
      const result = await this.CategoryService.deleteCategory(id);
      return res.status(result.status || 200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message || "Lỗi server" });
    }
  }
}

module.exports = new CategoryController(new (require("../Service/CategoryService"))());

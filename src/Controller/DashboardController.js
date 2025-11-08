const DashboardService = require("../Service/DashboardService");

class DashboardController {
  async getDashboard(req, res) {
    try {
      const stats = await DashboardService.getDashboardStats();
      res.status(200).json(stats); // Trả trực tiếp dữ liệu cho FE
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new DashboardController();

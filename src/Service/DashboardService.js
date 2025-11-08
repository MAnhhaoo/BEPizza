const Order = require("../models/OrderModel");
const User = require("../models/UserModels");
const Product = require("../models/ProductModel");

class DashboardService {
  async getDashboardStats() {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const revenueByMonthAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const revenueByMonth = Array(6)
      .fill(0)
      .map((_, i) => {
        const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1).getMonth() + 1;
        const found = revenueByMonthAgg.find((r) => r._id.month === month);
        return { month: `Tháng ${month}`, revenue: found ? found.revenue : 0 };
      });

    return { totalOrders, totalUsers, totalProducts, totalRevenue, revenueByMonth };
  }
}

module.exports = new DashboardService();

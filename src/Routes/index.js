const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const orderRouter = require("./OrderRoutes");
const dashboard = require("./dashboard"); // chắc chắn tên đúng

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/dashboard", dashboard); // ✅ phải là router
};

module.exports = routes;

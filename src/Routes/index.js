const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const orderRouter = require("./OrderRoutes");
const dashboard = require("./dashboard"); 
const EmployeeRoutes = require('./EmployeeRoutes'); 

const routes = (app) => {
app.use("/api/user", UserRouter);
app.use("/api/product", ProductRouter);
app.use("/api/order", orderRouter);
app.use("/api/dashboard", dashboard); 
app.use('/api/employees', EmployeeRoutes); 

};

module.exports = routes;
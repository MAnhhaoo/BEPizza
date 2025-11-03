const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter")
const orderRouter = require ("./OrderRoutes")
const routes = (app) =>{
    app.use("/api/user" , UserRouter)
    app.use("/api/product" , ProductRouter )
    app.use("/api/order" , orderRouter )

}

module.exports = routes
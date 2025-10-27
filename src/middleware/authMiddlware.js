const jwt  = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()

const authMiddleware = (req, res , next) => {
    // lay token tu header
    const token = req.headers.token.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if(err) {
            return res.status.json({
                message: "err"
            })
        }
        console.log("user" , user)
        if(user?.isAdmin){
            next();
        } else {
         return res.status.json({
                message: "err"
            })   
        }
});
}
module.exports = authMiddleware
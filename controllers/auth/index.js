const register = require("./register")
const login = require("./login")
const authenticate = require("../../middlewares/authenticate")


module.exports = {
    register,
    login,
    authenticate
}
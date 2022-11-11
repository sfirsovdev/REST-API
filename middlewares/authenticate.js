const jwt = require("jsonwebtoken")

const {RequestError} = require("../helpers/RequestError");

const {User} = require("../models/user")

const {SECRET_KEY} = process.env;
;
const authenticate = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [bearer, token] = authorization.split(" ");
        if (bearer !== "Bearer") {
            throw RequestError(401)
        } 
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user) {
            throw RequestError(401)
        }
        next()
    } catch (error) {
        if (!error.status) {
            error.status = 401;
            error.message = "Unauthorized";
    }
    next(error)
    }
}
module.exports = authenticate
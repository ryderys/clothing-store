const jwt = require("jsonwebtoken");
const { UserModel } = require("../../modules/user/user.model");
require("dotenv").config()
const httpError = require("http-errors")

const adminAuthMiddleware = async (req, res, next) => {
    try {
        const token = req?.cookies?.access_token;
        if(!token) throw new httpError.Unauthorized("وارد حساب ادمین خود شوید")

        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await UserModel.findById(data.id);
        if (!user || user.role !== 'admin') {
            throw new httpError.Unauthorized('Admin authentication failed');
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};
// const adminAuthMiddleware = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await UserModel.findById(decodedToken.userId);
//         if (!user || !user.isAdmin) {
//             throw new httpError.Unauthorized('Admin authentication failed');
//         }
//         req.user = user;
//         next();
//     } catch (error) {
//         next(error);
//     }
// };

module.exports = adminAuthMiddleware;
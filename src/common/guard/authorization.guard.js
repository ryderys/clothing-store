const httpError = require("http-errors")
const jwt = require("jsonwebtoken")
const {UserModel} = require("../../modules/user/user.model")
const { AuthMessages } = require("../../modules/auth/auth.messages")
require("dotenv").config()
const Authorization = async(req, res, next) => {
    try {
        // Retrieve the token from cookies
        const token = req?.cookies?.access_token
        
        // Debug logging for production troubleshooting
        if (process.env.NODE_ENV === "production") {
            console.log("Authorization Debug:", {
                hasCookies: !!req.cookies,
                cookieKeys: req.cookies ? Object.keys(req.cookies) : [],
                hasAccessToken: !!token,
                userAgent: req.headers['user-agent'],
                origin: req.headers['origin'],
                referer: req.headers['referer']
            });
        }
        
        // If token is not found, throw an unauthorized error
        if(!token) throw new httpError.Unauthorized(AuthMessages.LogIn)
        
         // Verify the token using the secret key
         
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(typeof data === 'object' && "id" in data){
            const user = await UserModel.findById(data.id, {accessToken: 0, otp: 0, __v: 0, updatedAt: 0, verifiedMobile: 0}).lean()
            if(!user) throw new httpError.Unauthorized(AuthMessages.UserNotFound)
            req.user = user
            return next()
        }
        throw new httpError.Unauthorized("invalid token")
    } catch (error) {
        console.log(error);
        next(error)
    }
}





module.exports = Authorization
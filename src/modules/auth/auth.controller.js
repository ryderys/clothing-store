const { UserModel } = require("../user/user.model");
const { randomInt } = require("crypto");
const httpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const CookieNames = require("../../common/constants/cookie.enum");
const autoBind = require("auto-bind");
const {
  getOtpSchema,
  checkOtpSchema,
} = require("../../common/validations/auth.validation");

const bcrypt = require("bcrypt");
const { logger } = require("../../common/utils/logger");
const { AuthMessages } = require("./auth.messages");

class UserAuthController {
  constructor() {
    autoBind(this);
  }
  async getOTP(req, res, next) {
    try {
      await getOtpSchema.validateAsync(req.body);
      const { mobile } = req.body;
      if (!mobile) {
        throw new httpError.BadRequest(AuthMessages.MobileRequired);
      }

      const user = await UserModel.findOne({ mobile });
      const now = Date.now();
      const otp = {
        code: randomInt(10000, 99999),
        expiresIn: now + 1000 * 60 * 1,
      };

      if (user) {
        if (user.otp && user.otp.expiresIn > now) {
          throw new httpError.BadRequest(AuthMessages.OTPNotExpired);
        }
        user.otp = otp;
        await user.save();
      } else {
        const newUser = await UserModel.create({ mobile, otp });
        // const cart = new CartModel({userId: newUser._id, items: []})
        // const savedItems = new savedItemsModel({userId: newUser._id, items: []})
        // await cart.save()
        // await savedItems.save()
        // newUser.cart = cart._id
        // newUser.savedItems = savedItems._id;
        await newUser.save();

        return res.status(StatusCodes.CREATED).json({
          statusCode: StatusCodes.CREATED,
          data: {
            message: AuthMessages.OTPSuccess,
            code: newUser.otp.code,
            mobile: newUser.mobile,
          },
        });
      }
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: {
          message: AuthMessages.OTPSuccess,
          code: user.otp.code,
          mobile: user.mobile,
        },
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async checkOTP(req, res, next) {
    try {
      await checkOtpSchema.validateAsync(req.body);
      const { mobile, code } = req.body;
      if (!mobile || !code) {
        throw new httpError.BadRequest(AuthMessages.MobileAndCodeRequired);
      }

      const user = await UserModel.findOne({ mobile });
      if (!user) throw new httpError.NotFound(AuthMessages.UserNotFound);

      const now = Date.now();
      if (user?.otp?.expiresIn < now)
        throw new httpError.Unauthorized(AuthMessages.OTPExpired);
      if (user?.otp?.code !== code)
        throw new httpError.Unauthorized(AuthMessages.InvalidOTP);

      if (!user.verifiedMobile) user.verifiedMobile = true;

      const accessToken = await this.signToken({ mobile, id: user._id });
      const refreshToken = await this.signRefreshToken({
        mobile,
        id: user._id,
      });
      console.log(``);

      const hashedRefreshToken = await this.hashToken(refreshToken);
      user.accessToken = accessToken;
      user.refreshToken = hashedRefreshToken;
      await user.save();

      this.setToken(res, accessToken, refreshToken);

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: {
          message: AuthMessages.LoginSuccess,
          user,
        },
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies[CookieNames.RefreshToken];
      if (!refreshToken) throw new httpError.Unauthorized(AuthMessages.LogIn);

      const decoded = await this.verifyRefreshToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY
      );
      if (!decoded) throw new httpError.Unauthorized(AuthMessages.LogIn);

      const user = await UserModel.findById(decoded.id);
      if (!user) throw new httpError.Unauthorized(AuthMessages.UserNotFound);

      const isMatch = await this.compareRefreshToken(
        refreshToken,
        user.refreshToken
      );
      if (!isMatch) {
        throw new httpError.Unauthorized(AuthMessages.RefreshFailed);
      }

      const accessToken = await this.signToken({
        mobile: decoded.mobile,
        id: decoded.id,
      });
      const newRefreshToken = await this.signRefreshToken({
        mobile: decoded.mobile,
        id: decoded.id,
      });

      const hashedNewRefreshToken = await this.hashToken(newRefreshToken);

      user.refreshToken = hashedNewRefreshToken;
      await user.save();
      this.setToken(res, accessToken, newRefreshToken);

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: {
          message: AuthMessages.RefreshSuccess,
        },
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const userId = req.user._id;
      if (!userId) throw new httpError.BadRequest(AuthMessages.LogIn);
      await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
      
      const isProduction = process.env.NODE_ENV === "production";
      
      res.clearCookie(CookieNames.AccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        domain: isProduction ? "clothing-store.liara.run" : undefined
      })
      .clearCookie(CookieNames.RefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        domain: isProduction ? "clothing-store.liara.run" : undefined
      });

      return res
        .status(StatusCodes.OK)
        .json({
          statusCode: StatusCodes.OK,
          data: {
            message: AuthMessages.LogOutSuccess,
          },
        });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  }

  async signRefreshToken(payload) {
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: "7d",
    });
    return refreshToken;
    // return crypto.createHash('sha256').update(refreshToken).digest('hex')
  }

  async hashToken(token) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(token, salt);
  }

  async verifyRefreshToken(token, secret) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }

  async compareRefreshToken(plainToken, hashedToken) {
    return bcrypt.compare(plainToken, hashedToken);
  }

  setToken(res, accessToken, refreshToken) {
    const isProduction = process.env.NODE_ENV === "production";
    
    return res
      .cookie(CookieNames.AccessToken, accessToken, {
        httpOnly: true,
        secure: isProduction, // Only require HTTPS in production
        sameSite: isProduction ? "none" : "lax", // Use lax for development
        maxAge: 1000 * 60 * 60,
        domain: isProduction ? "clothing-store.liara.run" : undefined // Update this to your production domain
      })  
      .cookie(CookieNames.RefreshToken, refreshToken, {
        httpOnly: true,
        secure: isProduction, // Only require HTTPS in production
        sameSite: isProduction ? "none" : "lax", // Use lax for development
        maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
        domain: isProduction ? "clothing-store.liara.run" : undefined // Update this to your production domain
      });
  }
}

module.exports = {
  UserAuthController: new UserAuthController(),
};

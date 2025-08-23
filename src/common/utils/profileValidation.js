const httpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

/**
 * Validates if user profile is complete for placing orders
 * @param {Object} user - User object from database
 * @returns {Object} Validation result with isComplete and missingFields
 */
const validateUserProfile = (user) => {
    const requiredFields = ['fullName', 'email'];
    const requiredAddressFields = ['street', 'city', 'state', 'postalCode'];
    
    const missingFields = requiredFields.filter(field => !user[field]);
    const missingAddressFields = requiredAddressFields.filter(field => !user.address?.[field]);
    
    const allMissingFields = [...missingFields, ...missingAddressFields.map(field => `address.${field}`)];
    
    return {
        isComplete: allMissingFields.length === 0,
        missingFields: allMissingFields,
        missingBasicFields: missingFields,
        missingAddressFields: missingAddressFields,
        message: allMissingFields.length > 0 
            ? `Please complete your profile. Missing: ${allMissingFields.join(', ')}`
            : 'Profile is complete'
    };
};

/**
 * Middleware to check if user profile is complete
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireCompleteProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { UserModel } = require("../../modules/user/user.model");
        
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new httpError.NotFound("User not found");
        }

        const validation = validateUserProfile(user);
        
        if (!validation.isComplete) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                statusCode: StatusCodes.BAD_REQUEST,
                data: {
                    message: "لطفااطلاعات حساب کاربری خود را تکمیل کنید",
                    redirectTo: "/profile",
                    missingFields: validation.missingFields,
                    missingBasicFields: validation.missingBasicFields,
                    missingAddressFields: validation.missingAddressFields
                }
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateUserProfile,
    requireCompleteProfile
};

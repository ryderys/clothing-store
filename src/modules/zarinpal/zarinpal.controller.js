const { default: axios } = require("axios");
const createHttpError = require("http-errors");
const { logger } = require("../../common/utils/logger");

require("dotenv").config()

async function zarinaplRequest(amount, user, description = "خرید محصول") {
    try {
        if (!amount || amount <= 0) {
            throw createHttpError.BadRequest("Invalid amount");
        }

        // Convert amount to Tomans (Zarinpal expects Tomans, not Rials)
        // If amount is already in Tomans, use as is; if in Rials, divide by 10
        const amountInTomans = Math.round(amount);

        const requestData = {
            merchant_id: process.env.ZARINPAL_MERCHANT_ID,
            callback_url: process.env.ZARINPAL_CALLBACK_URL,
            amount: amountInTomans,
            description,
            metadata: {
                email: user?.email,
                mobile: user?.mobile
            }
        };

        logger.info("Zarinpal request data:", requestData);

        const result = await axios.post(process.env.ZARINPAL_REQUEST_URL, requestData, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!result?.data?.data?.authority) {
            throw createHttpError.BadRequest("Failed to get payment authority");
        }

        return {
            authority: result.data.data.authority,
            payment_url: `${process.env.ZARINPAL_GATEWAY_URL}/${result.data.data.authority}`
        };
    } catch (error) {
        logger.error("Zarinpal request error:", {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                data: error.config?.data
            }
        });
        
        if (error.response?.data) {
            const errorMessage = error.response.data.errors ? 
                Object.values(error.response.data.errors).flat().join(', ') : 
                (error.response.data.message || "Payment request failed");
            throw createHttpError.BadRequest(`Zarinpal Error: ${errorMessage}`);
        }
        throw createHttpError.InternalServerError("Payment service unavailable");
    }
}

async function zarinpalVerify(amount, authority) {
    try {
        if (!amount || !authority) {
            throw createHttpError.BadRequest("Invalid amount or authority");
        }

        // Convert amount to Tomans (Zarinpal expects Tomans, not Rials)
        const amountInTomans = Math.round(amount);

        const result = await axios.post(process.env.ZARINPAL_VERIFY_URL, {
            merchant_id: process.env.ZARINPAL_MERCHANT_ID,
            authority,
            amount: amountInTomans,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!result?.data?.data) {
            throw createHttpError.BadRequest("Invalid verification response");
        }
        
        if (result.data.data.code === 100) {
            return result.data.data;
        } else if (result.data.data.code === 101) {
            throw createHttpError.Conflict("Payment already verified");
        }

        throw createHttpError.BadRequest(result.data.data.message || "Payment verification failed");
    } catch (error) {
        logger.error("Zarinpal verification error:", error);
        if (error.response?.data) {
            throw createHttpError.BadRequest(error.response.data.message || "Payment verification failed");
        }
        throw createHttpError.InternalServerError("Payment service unavailable");
    }
}

module.exports = {
    zarinaplRequest,
    zarinpalVerify
};
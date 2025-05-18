const { default: axios } = require("axios");
const { config } = require("dotenv");
const createHttpError = require("http-errors");
config()
async function zarinaplRequest(amount, user, description="خرید محصول") {
    const result = await axios.post(process.env.ZARINPAL_REQUEST_URL, {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        callback_url: process.env.ZARINPAL_CALLBACK_URL,
        amount,
        description,
        metaData: {
            email: user?.email,
            mobile: user?.mobile
        }
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.data)
    .catch(err => {
    console.log(err)
    }) 
    if(result.data?.authority){
        return {
            authority: result?.data?.authority,  
            payment_url: `${process.env.ZARINPAL_GATEWAY_URL}/${result?.data?.authority}`
        }
}
    throw createHttpError(400, 'zarinpal service not available')
}

async function zarinpalVerify(amount, authority) {
    const result = await axios.post(process.env.ZARINPAL_VERIFY_URL, {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        authority,
        amount,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.data)
    .catch(err => {
        console.log(err)
    })

    if(result?.data?.code == 100){
        return result?.data
    } else if(result?.data?.code == 101){
        throw createHttpError.Conflict("payment already verified")
    }
    throw createHttpError.InternalServerError("something is wrong")
}

module.exports = {
    zarinaplRequest,
    zarinpalVerify
}
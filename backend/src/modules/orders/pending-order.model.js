const { Schema, model } = require("mongoose");

const PendingOrderSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref:"User", required: true},
    items: [
        {
            productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
            quantity: {type: Number, required: true},
            price: {type: Number, required: true},
        }
    ],
    totalAmount: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now, expires: '1h'}
}, {timestamps: true})

const PendingOrderModel = model('PendingOrder', PendingOrderSchema)
module.exports = PendingOrderModel
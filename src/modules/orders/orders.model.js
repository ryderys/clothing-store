const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    items: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            quantity: {type: Number, required: true},
            price: {type: Number, required: true}
        }
    ],
    totalAmount: {type: Number, required: true},
    address: {type: String},
    status: {type: String, enum: ['Ordered','Pending', 'Processing', "Shipped", "out for delivery","Delivered", "cancelled"], default: 'Pending'},
}, {timestamps: true})

const OrderModel = mongoose.model('Order', OrderSchema)

module.exports = OrderModel
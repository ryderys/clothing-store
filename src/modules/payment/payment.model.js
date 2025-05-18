const { default: mongoose } = require("mongoose");

const PaymentSchema = new mongoose.Schema({
status: {type: Boolean, default: false },
amount: {type: Number },
refId: {type: String},
authority: {type: String },
orderId: {type: mongoose.Types.ObjectId, ref: "Order", required: true },
userId: {type: mongoose.Types.ObjectId, ref: "User", required: true },
})

const PaymentModel = mongoose.model("Payment", PaymentSchema)
module.exports = {
    PaymentModel
}
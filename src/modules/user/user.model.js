const { default: mongoose, Schema, Types } = require("mongoose");
const bcrypt = require("bcrypt")

const OTPSchema = new Schema({
    code: {type: String, required: false, default: undefined},
    expiresIn: {type: Number, required: false, default: 0},
})

const UserSchema = new mongoose.Schema({
    fullName: {type: String, trim: true},
    username: {type: String, lowercase: true, trim: true},
    email: {type: String, lowercase: true, trim: true},
    // password: {type: String},
    mobile: {type: String, required: true, unique: true},
    refreshToken: {type: String},
    verifiedMobile: {type: Boolean, default: false},
    otp: {type: OTPSchema },
    cart: {type: Schema.Types.ObjectId, ref: "Cart" },
    savedItems: {type: Schema.Types.ObjectId, ref: "SavedItems" },
    products: {type: [ Schema.Types.ObjectId], ref: 'Product', default: []},
    role: {type: String, enum: ['admin', 'user', 'quest'], default: 'user'}
}, {
    toJSON: {
        virtuals: true
    },
    timestamps: {createdAt: true, updatedAt: true}
})

UserSchema.index({fullName: "text", username: "text", mobile: "text", email: "text"})

// UserSchema.pre('save', async function(next){
//     if(this.isModified('refreshToken')){
//         const salt = await bcrypt.genSaltSync(10)
//         this.refreshToken = await bcrypt.hashSync(this.refreshToken, salt)
//     }
//     next()
// })

UserSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next()
})

module.exports = {
    UserModel: mongoose.model("User", UserSchema)
}
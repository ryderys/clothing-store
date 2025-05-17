const {default: mongoose, Schema, Types} = require("mongoose")



const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true},
    summary: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    tags: {type: [String], required: true},
    category: {type: Types.ObjectId, ref: 'Category'},
    price: {type: Number, required: true, default: 0},
    count: {type: Number},
    images: {type: [String], required: false, default: []},
    // likes: {type: [Schema.Types.ObjectId], ref: 'User', default: []},
    supplier: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    features: {type: Object, default: {}},
    averageRating: {type: Number, default: 0},
    reviewCount: {type: Number, default: 0},
}, {
    timestamps: {createdAt: true, updatedAt: true}
})
ProductSchema.index({title : "text", summary : "text", description : "text"})

ProductSchema.virtual("imagesURL").get(function(){
    return this.images.map(image => `${process.env.BASE_URL}:${process.env.PORT}/${image}`)
})
module.exports = {
    ProductModel : mongoose.model("Product", ProductSchema)
}
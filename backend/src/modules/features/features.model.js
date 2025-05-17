const { Schema, Types, model } = require("mongoose");

const FeaturesSchema = new Schema({
    title: {type: String, required: true}, //rang
    key: {type: String, required: true}, //color
    type: {type: String, enum: ["number", "string", "array", "boolean"]}, //color
    list: {type: Array, default: []}, //color choosing
    guid: {type: String, required: false}, //rahnama
    category: {type: Types.ObjectId, ref: "Category", required: true}
})

const FeaturesModel = model("Feature", FeaturesSchema)
module.exports = FeaturesModel
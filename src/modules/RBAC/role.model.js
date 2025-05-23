const { default: mongoose } = require("mongoose");

const RoleSchema = new mongoose.Schema({
    title: {type: String, unique: true},
    description: {type: String, default: ""},
    permissions: {type: [mongoose.Types.ObjectId], ref: "permission", default: []},
}, {
    toJSON: {
        virtuals: true
    }
})
const RoleModel = mongoose.model("role", RoleSchema)
module.exports = {RoleModel}
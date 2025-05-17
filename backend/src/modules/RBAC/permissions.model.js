const { default: mongoose } = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    description: {type: String, default: ""},
}, {
    toJSON: {
        virtuals: true
    }
})
const PermissionModel = mongoose.model("permission", PermissionSchema)
module.exports = {PermissionModel}
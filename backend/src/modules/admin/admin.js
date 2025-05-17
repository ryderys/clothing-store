const { default: mongoose } = require("mongoose")
const { UserModel } = require("../user/user.model")
const bcrypt = require("bcrypt")
async function createAdminUser(){
    try {
        await mongoose.connect('your_mongo_connection_string', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        let user = await UserModel.findOne({email: adminEmail})
        if(user){
            console.log('admin user already exists');
            return
        }

        const hashedPassword = await bcrypt.hashSync(adminPassword, 10)

        user = new UserModel({
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        })
        await user.save()
        console.log("admin user created successfully");
    } catch (error) {
        next(error)
    } finally {
        mongoose.disconnect()
    }
}

createAdminUser()
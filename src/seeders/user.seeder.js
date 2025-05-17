const { UserModel } = require('../modules/user/user.model');
const connectDB = require('../config/database.config');
const mongoose = require('mongoose');
require('dotenv').config();

const sampleUsers = [
    // Admin users
    {
        fullName: "Admin User",
        username: "admin",
        email: "admin@clothingstore.com",
        mobile: "1234567890",
        verifiedMobile: true,
        role: "admin"
    },
    {
        fullName: "Super Admin",
        username: "superadmin",
        email: "superadmin@clothingstore.com",
        mobile: "1234567891",
        verifiedMobile: true,
        role: "admin"
    },
    // Men's clothing suppliers
    {
        fullName: "John Clothing Supplier",
        username: "johnclothing",
        email: "john@clothing.com",
        mobile: "1234567892",
        verifiedMobile: true,
        role: "user"
    },
    {
        fullName: "Sarah Casual Wear",
        username: "sarahcasual",
        email: "sarah@casual.com",
        mobile: "1234567893",
        verifiedMobile: true,
        role: "user"
    },
    // Women's clothing suppliers
    {
        fullName: "Mike Fashion House",
        username: "mikefashion",
        email: "mike@fashion.com",
        mobile: "1234567894",
        verifiedMobile: true,
        role: "user"
    },
    {
        fullName: "Lisa Denim Co",
        username: "lisadenim",
        email: "lisa@denim.com",
        mobile: "1234567895",
        verifiedMobile: true,
        role: "user"
    },
    // Accessories suppliers
    {
        fullName: "David Accessories",
        username: "davidaccessories",
        email: "david@accessories.com",
        mobile: "1234567896",
        verifiedMobile: true,
        role: "user"
    },
    {
        fullName: "Emma Luxury Goods",
        username: "emmaluxury",
        email: "emma@luxury.com",
        mobile: "1234567897",
        verifiedMobile: true,
        role: "user"
    },
    // Footwear suppliers
    {
        fullName: "Alex Shoes",
        username: "alexshoes",
        email: "alex@shoes.com",
        mobile: "1234567898",
        verifiedMobile: true,
        role: "user"
    },
    {
        fullName: "Sophie Footwear",
        username: "sophieshoes",
        email: "sophie@shoes.com",
        mobile: "1234567899",
        verifiedMobile: true,
        role: "user"
    },
    // Regular customers
    {
        fullName: "Regular Customer 1",
        username: "customer1",
        email: "customer1@example.com",
        mobile: "1234567900",
        verifiedMobile: true,
        role: "user"
    },
    {
        fullName: "Regular Customer 2",
        username: "customer2",
        email: "customer2@example.com",
        mobile: "1234567901",
        verifiedMobile: true,
        role: "user"
    }
];

const seedUsers = async () => {
    try {
        // Connect to MongoDB using the new configuration
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing users
        await UserModel.deleteMany({});
        console.log('Cleared existing users');

        // Insert new users
        const users = await UserModel.insertMany(sampleUsers);
        console.log(`Successfully seeded ${users.length} users`);

        // Return the user IDs for use in product seeder
        return {
            admin: users[0]._id,
            superAdmin: users[1]._id,
            johnClothing: users[2]._id,
            sarahCasual: users[3]._id,
            mikeFashion: users[4]._id,
            lisaDenim: users[5]._id,
            davidAccessories: users[6]._id,
            emmaLuxury: users[7]._id,
            alexShoes: users[8]._id,
            sophieShoes: users[9]._id,
            customer1: users[10]._id,
            customer2: users[11]._id
        };

    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

// Export the seeder function
module.exports = { seedUsers }; 
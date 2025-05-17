const { UserModel } = require('../modules/user/user.model');
const connectDB = require('../config/database.config');
const mongoose = require('mongoose');
require('dotenv').config();

const sampleUsers = [
    // Admin users
    {
        fullName: "Admin User",
        username: "admin",
        email: "admin@example.com",
        mobile: "1234567890",
        verifiedMobile: true,
        role: "admin"
    },
    {
        fullName: "Super Admin",
        username: "superadmin",
        email: "superadmin@example.com",
        mobile: "1234567891",
        verifiedMobile: true,
        role: "admin"
    },
    // Audio suppliers
    {
        fullName: "John Audio Supplier",
        username: "johnaudio",
        email: "john@audio.com",
        mobile: "1234567892",
        verifiedMobile: true,
        role: "user"
    },
    {
        fullName: "Sarah Speaker Supplier",
        username: "sarahspeaker",
        email: "sarah@speaker.com",
        mobile: "1234567893",
        verifiedMobile: true,
        role: "user"
    },
    // Wearable suppliers
    {
        fullName: "Mike Watch Supplier",
        username: "mikewatch",
        email: "mike@watch.com",
        mobile: "1234567894",
        verifiedMobile: true,
        role: "user"
    },
    {
        fullName: "Lisa Fitness Supplier",
        username: "lisafitness",
        email: "lisa@fitness.com",
        mobile: "1234567895",
        verifiedMobile: true,
        role: "user"
    },
    // Computer suppliers
    {
        fullName: "David Laptop Supplier",
        username: "davidlaptop",
        email: "david@laptop.com",
        mobile: "1234567896",
        verifiedMobile: true,
        role: "user"
    },
    {
        fullName: "Emma Desktop Supplier",
        username: "emmadesktop",
        email: "emma@desktop.com",
        mobile: "1234567897",
        verifiedMobile: true,
        role: "user"
    },
    // Gaming suppliers
    {
        fullName: "Alex Gaming Supplier",
        username: "alexgaming",
        email: "alex@gaming.com",
        mobile: "1234567898",
        verifiedMobile: true,
        role: "user"
    },
    {
        fullName: "Sophie Accessories Supplier",
        username: "sophieaccessories",
        email: "sophie@accessories.com",
        mobile: "1234567899",
        verifiedMobile: true,
        role: "user"
    },
    // Regular users
    {
        fullName: "Regular User 1",
        username: "user1",
        email: "user1@example.com",
        mobile: "1234567900",
        verifiedMobile: true,
        role: "user"
    },
    {
        fullName: "Regular User 2",
        username: "user2",
        email: "user2@example.com",
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
            johnAudio: users[2]._id,
            sarahSpeaker: users[3]._id,
            mikeWatch: users[4]._id,
            lisaFitness: users[5]._id,
            davidLaptop: users[6]._id,
            emmaDesktop: users[7]._id,
            alexGaming: users[8]._id,
            sophieAccessories: users[9]._id,
            regularUser1: users[10]._id,
            regularUser2: users[11]._id
        };

    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

// Export the seeder function
module.exports = { seedUsers }; 
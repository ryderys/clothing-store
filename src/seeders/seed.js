const { seedUsers } = require('./user.seeder');
const { seedCategories } = require('./category.seeder');
const { seedProducts } = require('./product.seeder');
const connectDB = require('../config/database.config');
const mongoose = require('mongoose');

const runSeeders = async () => {
    try {
        console.log('Starting database seeding...');
        
        // Connect to MongoDB once at the start
        await connectDB();
        console.log('Connected to MongoDB');

        // Step 1: Seed users
        console.log('\nSeeding users...');
        const userIds = await seedUsers();
        console.log('Users seeded successfully');

        // Step 2: Seed categories
        console.log('\nSeeding categories...');
        const categoryIds = await seedCategories();
        console.log('Categories seeded successfully');

        // Step 3: Seed products
        console.log('\nSeeding products...');
        await seedProducts(userIds, categoryIds);
        console.log('Products seeded successfully');

        console.log('\nAll seeders completed successfully!');
        
        // Disconnect from MongoDB after all operations are complete
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        
        process.exit(0);
    } catch (error) {
        console.error('Error running seeders:', error);
        // Ensure we disconnect even if there's an error
        await mongoose.disconnect();
        process.exit(1);
    }
};

// Run the seeders
runSeeders(); 
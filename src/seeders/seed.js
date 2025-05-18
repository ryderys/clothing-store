const { seedUsers } = require('./user.seeder');
const { seedCategories } = require('./category.seeder');
const { seedProducts } = require('./product.seeder');

const runSeeders = async () => {
    try {
        console.log('Starting database seeding...');

        // Step 1: Seed users
        console.log('\nSeeding users...');
        const userIds = await seedUsers();
        console.log('Users seeded successfully');

        // Step 2: Seed categories
        console.log('\nSeeding categories...');
        const categoryIds = await seedCategories();
        console.log('Categories seeded successfully');
p
        // Step 3: Seed products
        console.log('\nSeeding products...');
        await seedProducts(userIds, categoryIds);
        console.log('Products seeded successfully');

        console.log('\nAll seeders completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error running seeders:', error);
        process.exit(1);
    }
};

// Run the seeders
runSeeders(); 
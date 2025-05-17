const { CategoryModel } = require('../modules/category/category.model');
const connectDB = require('../config/database.config');
const mongoose = require('mongoose');
require('dotenv').config();

const sampleCategories = [
    // Main categories
    {
        title: "Clothing",
        slug: "clothing",
        icon: "clothing-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Men",
        slug: "men",
        icon: "men-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Women",
        slug: "women",
        icon: "women-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Accessories",
        slug: "accessories",
        icon: "accessories-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Footwear",
        slug: "footwear",
        icon: "footwear-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Sale",
        slug: "sale",
        icon: "sale-icon.png",
        parent: null,
        parents: []
    },
    // Men's subcategories
    {
        title: "Men's Shirts",
        slug: "mens-shirts",
        icon: "mens-shirts-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Men's Pants",
        slug: "mens-pants",
        icon: "mens-pants-icon.png",
        parent: null,
        parents: []
    },
    // Women's subcategories
    {
        title: "Women's Dresses",
        slug: "womens-dresses",
        icon: "womens-dresses-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Women's Jeans",
        slug: "womens-jeans",
        icon: "womens-jeans-icon.png",
        parent: null,
        parents: []
    },
    // Accessories subcategories
    {
        title: "Bags",
        slug: "bags",
        icon: "bags-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Scarves",
        slug: "scarves",
        icon: "scarves-icon.png",
        parent: null,
        parents: []
    },
    // Footwear subcategories
    {
        title: "Boots",
        slug: "boots",
        icon: "boots-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Sneakers",
        slug: "sneakers",
        icon: "sneakers-icon.png",
        parent: null,
        parents: []
    }
];

const seedCategories = async () => {
    try {
        // Connect to MongoDB using the new configuration
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing categories
        await CategoryModel.deleteMany({});
        console.log('Cleared existing categories');

        // Insert main categories first
        const clothing = await CategoryModel.create(sampleCategories[0]);
        const men = await CategoryModel.create(sampleCategories[1]);
        const women = await CategoryModel.create(sampleCategories[2]);
        const accessories = await CategoryModel.create(sampleCategories[3]);
        const footwear = await CategoryModel.create(sampleCategories[4]);
        const sale = await CategoryModel.create(sampleCategories[5]);

        // Insert and update subcategories
        const mensShirts = await CategoryModel.create({
            ...sampleCategories[6],
            parent: men._id,
            parents: [men._id]
        });

        const mensPants = await CategoryModel.create({
            ...sampleCategories[7],
            parent: men._id,
            parents: [men._id]
        });

        const womensDresses = await CategoryModel.create({
            ...sampleCategories[8],
            parent: women._id,
            parents: [women._id]
        });

        const womensJeans = await CategoryModel.create({
            ...sampleCategories[9],
            parent: women._id,
            parents: [women._id]
        });

        const bags = await CategoryModel.create({
            ...sampleCategories[10],
            parent: accessories._id,
            parents: [accessories._id]
        });

        const scarves = await CategoryModel.create({
            ...sampleCategories[11],
            parent: accessories._id,
            parents: [accessories._id]
        });

        const boots = await CategoryModel.create({
            ...sampleCategories[12],
            parent: footwear._id,
            parents: [footwear._id]
        });

        const sneakers = await CategoryModel.create({
            ...sampleCategories[13],
            parent: footwear._id,
            parents: [footwear._id]
        });

        // Update parent categories with Clothing as their parent
        await CategoryModel.updateMany(
            { _id: { $in: [men._id, women._id, accessories._id, footwear._id, sale._id] } },
            { $set: { parent: clothing._id, parents: [clothing._id] } }
        );

        console.log('Successfully seeded categories');

        // Return the category IDs for use in product seeder
        return {
            clothing: clothing._id,
            men: men._id,
            women: women._id,
            accessories: accessories._id,
            footwear: footwear._id,
            sale: sale._id,
            mensShirts: mensShirts._id,
            mensPants: mensPants._id,
            womensDresses: womensDresses._id,
            womensJeans: womensJeans._id,
            bags: bags._id,
            scarves: scarves._id,
            boots: boots._id,
            sneakers: sneakers._id
        };

    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

// Export the seeder function
module.exports = { seedCategories }; 
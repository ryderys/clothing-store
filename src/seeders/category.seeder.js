const { CategoryModel } = require('../modules/category/category.model');
const connectDB = require('../config/database.config');
const mongoose = require('mongoose');
require('dotenv').config();

const sampleCategories = [
    // Electronics and its subcategories
    {
        title: "Electronics",
        slug: "electronics",
        icon: "electronics-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Audio",
        slug: "audio",
        icon: "audio-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Wearables",
        slug: "wearables",
        icon: "wearables-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Cameras",
        slug: "cameras",
        icon: "cameras-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Computers",
        slug: "computers",
        icon: "computers-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Gaming",
        slug: "gaming",
        icon: "gaming-icon.png",
        parent: null,
        parents: []
    },
    // Audio subcategories
    {
        title: "Headphones",
        slug: "headphones",
        icon: "headphones-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Speakers",
        slug: "speakers",
        icon: "speakers-icon.png",
        parent: null,
        parents: []
    },
    // Wearables subcategories
    {
        title: "Smartwatches",
        slug: "smartwatches",
        icon: "smartwatches-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Fitness Trackers",
        slug: "fitness-trackers",
        icon: "fitness-trackers-icon.png",
        parent: null,
        parents: []
    },
    // Computers subcategories
    {
        title: "Laptops",
        slug: "laptops",
        icon: "laptops-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Desktops",
        slug: "desktops",
        icon: "desktops-icon.png",
        parent: null,
        parents: []
    },
    // Gaming subcategories
    {
        title: "Gaming Consoles",
        slug: "gaming-consoles",
        icon: "gaming-consoles-icon.png",
        parent: null,
        parents: []
    },
    {
        title: "Gaming Accessories",
        slug: "gaming-accessories",
        icon: "gaming-accessories-icon.png",
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
        const electronics = await CategoryModel.create(sampleCategories[0]);
        const audio = await CategoryModel.create(sampleCategories[1]);
        const wearables = await CategoryModel.create(sampleCategories[2]);
        const cameras = await CategoryModel.create(sampleCategories[3]);
        const computers = await CategoryModel.create(sampleCategories[4]);
        const gaming = await CategoryModel.create(sampleCategories[5]);

        // Insert and update subcategories
        const headphones = await CategoryModel.create({
            ...sampleCategories[6],
            parent: audio._id,
            parents: [audio._id]
        });

        const speakers = await CategoryModel.create({
            ...sampleCategories[7],
            parent: audio._id,
            parents: [audio._id]
        });

        const smartwatches = await CategoryModel.create({
            ...sampleCategories[8],
            parent: wearables._id,
            parents: [wearables._id]
        });

        const fitnessTrackers = await CategoryModel.create({
            ...sampleCategories[9],
            parent: wearables._id,
            parents: [wearables._id]
        });

        const laptops = await CategoryModel.create({
            ...sampleCategories[10],
            parent: computers._id,
            parents: [computers._id]
        });

        const desktops = await CategoryModel.create({
            ...sampleCategories[11],
            parent: computers._id,
            parents: [computers._id]
        });

        const gamingConsoles = await CategoryModel.create({
            ...sampleCategories[12],
            parent: gaming._id,
            parents: [gaming._id]
        });

        const gamingAccessories = await CategoryModel.create({
            ...sampleCategories[13],
            parent: gaming._id,
            parents: [gaming._id]
        });

        // Update parent categories with Electronics as their parent
        await CategoryModel.updateMany(
            { _id: { $in: [audio._id, wearables._id, cameras._id, computers._id, gaming._id] } },
            { $set: { parent: electronics._id, parents: [electronics._id] } }
        );

        console.log('Successfully seeded categories');

        // Return the category IDs for use in product seeder
        return {
            electronics: electronics._id,
            audio: audio._id,
            wearables: wearables._id,
            cameras: cameras._id,
            computers: computers._id,
            gaming: gaming._id,
            headphones: headphones._id,
            speakers: speakers._id,
            smartwatches: smartwatches._id,
            fitnessTrackers: fitnessTrackers._id,
            laptops: laptops._id,
            desktops: desktops._id,
            gamingConsoles: gamingConsoles._id,
            gamingAccessories: gamingAccessories._id
        };

    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

// Export the seeder function
module.exports = { seedCategories }; 
const { CategoryModel } = require('../modules/category/category.model');
require('dotenv').config();

const sampleCategories = [
    // Main categories
    {
        title: "Clothing",
        slug: "clothing",
        icon: "clothing-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    {
        title: "Men",
        slug: "men",
        icon: "men-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    {
        title: "Women",
        slug: "women",
        icon: "women-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    {
        title: "Accessories",
        slug: "accessories",
        icon: "accessories-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    {
        title: "Footwear",
        slug: "footwear",
        icon: "footwear-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    {
        title: "Sale",
        slug: "sale",
        icon: "sale-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    // Men's subcategories
    {
        title: "Men's Shirts",
        slug: "mens-shirts",
        icon: "mens-shirts-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    {
        title: "Men's Pants",
        slug: "mens-pants",
        icon: "mens-pants-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    // Women's subcategories
    {
        title: "Women's Dresses",
        slug: "womens-dresses",
        icon: "womens-dresses-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    {
        title: "Women's Jeans",
        slug: "womens-jeans",
        icon: "womens-jeans-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    // Accessories subcategories
    {
        title: "Bags",
        slug: "bags",
        icon: "bags-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    {
        title: "Scarves",
        slug: "scarves",
        icon: "scarves-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    // Footwear subcategories
    {
        title: "Boots",
        slug: "boots",
        icon: "boots-icon.png",
        photo: null,
        parent: null,
        parents: []
    },
    {
        title: "Sneakers",
        slug: "sneakers",
        icon: "sneakers-icon.png",
        photo: null,
        parent: null,
        parents: []
    }
];

const seedCategories = async () => {
    try {
        // Drop the collection to ensure clean state
        await CategoryModel.collection.drop().catch(err => {
            if (err.code !== 26) { // 26 is the error code for "namespace not found"
                throw err;
            }
        });
        console.log('Dropped categories collection');

        // Insert all categories at once
        const categories = await CategoryModel.insertMany(sampleCategories);
        console.log(`Successfully inserted ${categories.length} categories`);

        // Get references to main categories
        const clothing = categories.find(c => c.title === "Clothing");
        const men = categories.find(c => c.title === "Men");
        const women = categories.find(c => c.title === "Women");
        const accessories = categories.find(c => c.title === "Accessories");
        const footwear = categories.find(c => c.title === "Footwear");
        const sale = categories.find(c => c.title === "Sale");

        // Update subcategories with their parent references
        await CategoryModel.updateMany(
            { title: { $in: ["Men's Shirts", "Men's Pants"] } },
            { $set: { parent: men._id, parents: [men._id] } }
        );

        await CategoryModel.updateMany(
            { title: { $in: ["Women's Dresses", "Women's Jeans"] } },
            { $set: { parent: women._id, parents: [women._id] } }
        );

        await CategoryModel.updateMany(
            { title: { $in: ["Bags", "Scarves"] } },
            { $set: { parent: accessories._id, parents: [accessories._id] } }
        );

        await CategoryModel.updateMany(
            { title: { $in: ["Boots", "Sneakers"] } },
            { $set: { parent: footwear._id, parents: [footwear._id] } }
        );

        // Update main categories with Clothing as their parent
        await CategoryModel.updateMany(
            { _id: { $in: [men._id, women._id, accessories._id, footwear._id, sale._id] } },
            { $set: { parent: clothing._id, parents: [clothing._id] } }
        );

        console.log('Successfully updated category relationships');

        // Return the category IDs for use in product seeder
        return {
            clothing: clothing._id,
            men: men._id,
            women: women._id,
            accessories: accessories._id,
            footwear: footwear._id,
            sale: sale._id,
            mensShirts: categories.find(c => c.title === "Men's Shirts")._id,
            mensPants: categories.find(c => c.title === "Men's Pants")._id,
            womensDresses: categories.find(c => c.title === "Women's Dresses")._id,
            womensJeans: categories.find(c => c.title === "Women's Jeans")._id,
            bags: categories.find(c => c.title === "Bags")._id,
            scarves: categories.find(c => c.title === "Scarves")._id,
            boots: categories.find(c => c.title === "Boots")._id,
            sneakers: categories.find(c => c.title === "Sneakers")._id
        };

    } catch (error) {
        console.error('Error seeding categories:', error);
        throw error; // Propagate the error instead of exiting
    }
};

// Export the seeder function
module.exports = { seedCategories }; 
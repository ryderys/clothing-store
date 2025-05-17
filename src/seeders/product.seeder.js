const { ProductModel } = require('../modules/product/product.model');
const { seedCategories } = require('./category.seeder');
const { seedUsers } = require('./user.seeder');
const connectDB = require('../config/database.config');
const mongoose = require('mongoose');
require('dotenv').config();

const seedProducts = async () => {
    try {
        // Connect to MongoDB using the new configuration
        await connectDB();
        console.log('Connected to MongoDB');

        // First seed categories and users to get their IDs
        const categoryIds = await seedCategories();
        const userIds = await seedUsers();
        console.log('Categories and users seeded successfully');

        const sampleProducts = [
            // Men's Clothing
            {
                title: "Classic Fit Dress Shirt",
                summary: "Premium cotton dress shirt with a comfortable classic fit",
                description: "A timeless dress shirt made from high-quality cotton. Features a button-down collar, single chest pocket, and a comfortable classic fit that's perfect for both formal and casual occasions.",
                tags: ["men", "formal", "shirts"],
                category: categoryIds.mensShirts,
                supplier: userIds.johnClothing,
                price: 49.99,
                count: 100,
                images: ["dress-shirt-1.jpg", "dress-shirt-2.jpg"],
                features: {
                    material: "100% Premium Cotton",
                    fit: "Classic Fit",
                    collar: "Button-down",
                    care: "Machine washable"
                },
                averageRating: 4.5,
                reviewCount: 120
            },
            {
                title: "Slim Fit Chino Pants",
                summary: "Modern slim fit chinos in versatile colors",
                description: "Contemporary slim fit chinos made from stretch cotton for comfort and mobility. Perfect for both casual and semi-formal occasions.",
                tags: ["men", "pants", "casual"],
                category: categoryIds.mensPants,
                supplier: userIds.sarahCasual,
                price: 59.99,
                count: 75,
                images: ["chinos-1.jpg", "chinos-2.jpg"],
                features: {
                    material: "98% Cotton, 2% Elastane",
                    fit: "Slim Fit",
                    closure: "Button and zip",
                    pockets: "4 pockets"
                },
                averageRating: 4.3,
                reviewCount: 85
            },
            // Women's Clothing
            {
                title: "Floral Summer Dress",
                summary: "Light and breezy floral print dress for summer",
                description: "A beautiful floral print dress perfect for summer days. Features a flattering A-line silhouette and comfortable elastic waistband.",
                tags: ["women", "dresses", "summer"],
                category: categoryIds.womensDresses,
                supplier: userIds.mikeFashion,
                price: 69.99,
                count: 50,
                images: ["floral-dress-1.jpg", "floral-dress-2.jpg"],
                features: {
                    material: "Polyester Blend",
                    fit: "A-line",
                    length: "Knee-length",
                    care: "Machine wash cold"
                },
                averageRating: 4.7,
                reviewCount: 95
            },
            {
                title: "High-Waisted Jeans",
                summary: "Stylish high-waisted jeans with stretch comfort",
                description: "Modern high-waisted jeans with the perfect amount of stretch for all-day comfort. Features a classic five-pocket design and versatile wash.",
                tags: ["women", "jeans", "denim"],
                category: categoryIds.womensJeans,
                supplier: userIds.lisaDenim,
                price: 79.99,
                count: 100,
                images: ["jeans-1.jpg", "jeans-2.jpg"],
                features: {
                    material: "98% Cotton, 2% Elastane",
                    fit: "High-waisted",
                    rise: "10 inches",
                    style: "Skinny"
                },
                averageRating: 4.6,
                reviewCount: 150
            },
            // Accessories
            {
                title: "Leather Crossbody Bag",
                summary: "Elegant leather crossbody bag with adjustable strap",
                description: "A versatile leather crossbody bag that combines style and functionality. Features multiple compartments and an adjustable strap.",
                tags: ["accessories", "bags", "leather"],
                category: categoryIds.accessories,
                supplier: userIds.davidAccessories,
                price: 89.99,
                count: 40,
                images: ["crossbody-1.jpg", "crossbody-2.jpg"],
                features: {
                    material: "Genuine Leather",
                    dimensions: "10\" x 7\" x 2\"",
                    closure: "Magnetic snap",
                    strap: "Adjustable"
                },
                averageRating: 4.8,
                reviewCount: 65
            },
            {
                title: "Silk Scarf",
                summary: "Luxurious silk scarf with geometric pattern",
                description: "A beautiful silk scarf featuring a modern geometric pattern. Perfect for adding a touch of elegance to any outfit.",
                tags: ["accessories", "scarves", "silk"],
                category: categoryIds.accessories,
                supplier: userIds.emmaLuxury,
                price: 49.99,
                count: 60,
                images: ["scarf-1.jpg", "scarf-2.jpg"],
                features: {
                    material: "100% Silk",
                    dimensions: "35\" x 35\"",
                    care: "Dry clean only",
                    pattern: "Geometric"
                },
                averageRating: 4.9,
                reviewCount: 45
            },
            // Footwear
            {
                title: "Leather Ankle Boots",
                summary: "Classic leather ankle boots with block heel",
                description: "Timeless leather ankle boots featuring a comfortable block heel and durable construction. Perfect for both casual and dressy occasions.",
                tags: ["footwear", "boots", "leather"],
                category: categoryIds.footwear,
                supplier: userIds.alexShoes,
                price: 129.99,
                count: 50,
                images: ["boots-1.jpg", "boots-2.jpg"],
                features: {
                    material: "Genuine Leather",
                    heel: "2.5 inch block heel",
                    sole: "Rubber",
                    closure: "Side zipper"
                },
                averageRating: 4.7,
                reviewCount: 85
            },
            {
                title: "Canvas Sneakers",
                summary: "Classic canvas sneakers with rubber sole",
                description: "Comfortable and versatile canvas sneakers perfect for everyday wear. Features a durable rubber sole and classic design.",
                tags: ["footwear", "sneakers", "casual"],
                category: categoryIds.footwear,
                supplier: userIds.sophieShoes,
                price: 59.99,
                count: 100,
                images: ["sneakers-1.jpg", "sneakers-2.jpg"],
                features: {
                    material: "Canvas upper",
                    sole: "Rubber",
                    closure: "Lace-up",
                    style: "Low-top"
                },
                averageRating: 4.5,
                reviewCount: 120
            }
        ];

        // Clear existing products
        await ProductModel.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const products = await ProductModel.insertMany(sampleProducts);
        console.log(`Successfully seeded ${products.length} products`);

        // Update suppliers' products array
        await Promise.all([
            UserModel.updateOne(
                { _id: userIds.johnClothing },
                { $push: { products: products[0]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.sarahCasual },
                { $push: { products: products[1]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.mikeFashion },
                { $push: { products: products[2]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.lisaDenim },
                { $push: { products: products[3]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.davidAccessories },
                { $push: { products: products[4]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.emmaLuxury },
                { $push: { products: products[5]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.alexShoes },
                { $push: { products: products[6]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.sophieShoes },
                { $push: { products: products[7]._id } }
            )
        ]);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

// Run the seeder
seedProducts(); 
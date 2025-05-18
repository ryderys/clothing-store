const { ProductModel } = require('../modules/product/product.model');
const { seedCategories } = require('./category.seeder');
const { seedUsers } = require('./user.seeder');
const { UserModel } = require('../modules/user/user.model');
require('dotenv').config();

const seedProducts = async (userIds, categoryIds) => {
    try {
        // Clear existing products
        await ProductModel.deleteMany({});
        console.log('Cleared existing products');

        const sampleProducts = [
            // Men's Clothing
            {
                title: "Classic White T-Shirt",
                summary: "Essential cotton t-shirt for everyday wear",
                description: "Premium quality cotton t-shirt with a comfortable fit. Perfect for casual wear and everyday use.",
                tags: ["t-shirt", "casual", "cotton"],
                category: categoryIds.mensShirts,
                supplier: userIds.johnClothing,
                price: 150000, // 150,000 Toman
                count: 100,
                images: ["https://example.com/white-tshirt-1.jpg", "https://example.com/white-tshirt-2.jpg"],
                features: ["100% Cotton", "Regular Fit", "Machine Washable"],
                averageRating: 4.5,
                reviewCount: 25
            },
            {
                title: "Slim Fit Jeans",
                summary: "Modern slim fit jeans with stretch comfort",
                description: "Stylish slim fit jeans made with premium denim and added stretch for comfort. Perfect for a modern look.",
                tags: ["jeans", "slim-fit", "denim"],
                category: categoryIds.mensPants,
                supplier: userIds.johnClothing,
                price: 450000, // 450,000 Toman
                count: 50,
                images: ["https://example.com/jeans-1.jpg", "https://example.com/jeans-2.jpg"],
                features: ["98% Cotton, 2% Elastane", "Slim Fit", "Button and Zip Closure"],
                averageRating: 4.3,
                reviewCount: 18
            },
            // Women's Clothing
            {
                title: "Floral Summer Dress",
                summary: "Light and breezy floral dress for summer",
                description: "Beautiful floral print dress perfect for summer days. Made with lightweight fabric for maximum comfort.",
                tags: ["dress", "summer", "floral"],
                category: categoryIds.womensDresses,
                supplier: userIds.mikeFashion,
                price: 350000, // 350,000 Toman
                count: 75,
                images: ["https://example.com/dress-1.jpg", "https://example.com/dress-2.jpg"],
                features: ["Lightweight Fabric", "Floral Print", "A-line Silhouette"],
                averageRating: 4.7,
                reviewCount: 32
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
                summary: "Stylish and practical leather bag",
                description: "High-quality leather crossbody bag with multiple compartments. Perfect for everyday use.",
                tags: ["bag", "leather", "accessories"],
                category: categoryIds.accessories,
                supplier: userIds.davidAccessories,
                price: 850000, // 850,000 Toman
                count: 30,
                images: ["https://example.com/bag-1.jpg", "https://example.com/bag-2.jpg"],
                features: ["Genuine Leather", "Adjustable Strap", "Multiple Compartments"],
                averageRating: 4.8,
                reviewCount: 15
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
                title: "Running Shoes",
                summary: "Lightweight running shoes with cushioning",
                description: "Professional running shoes with advanced cushioning technology. Perfect for runners of all levels.",
                tags: ["shoes", "running", "sports"],
                category: categoryIds.footwear,
                supplier: userIds.alexShoes,
                price: 1200000, // 1,200,000 Toman
                count: 40,
                images: ["https://example.com/shoes-1.jpg", "https://example.com/shoes-2.jpg"],
                features: ["Breathable Mesh", "Cushioned Midsole", "Rubber Outsole"],
                averageRating: 4.6,
                reviewCount: 28
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

    } catch (error) {
        console.error('Error seeding products:', error);
        throw error; // Propagate the error instead of exiting
    }
};

// Export the seeder function
module.exports = { seedProducts }; 
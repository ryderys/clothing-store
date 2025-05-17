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
            // Audio Products
            {
                title: "Premium Wireless Headphones",
                summary: "High-quality wireless headphones with noise cancellation",
                description: "Experience crystal-clear sound with our premium wireless headphones. Features include active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
                tags: ["electronics", "audio", "wireless"],
                category: categoryIds.headphones,
                supplier: userIds.johnAudio,
                price: 199.99,
                count: 50,
                images: ["headphones-1.jpg", "headphones-2.jpg"],
                features: {
                    batteryLife: "30 hours",
                    connectivity: "Bluetooth 5.0",
                    noiseCancellation: "Active",
                    weight: "250g"
                },
                averageRating: 4.5,
                reviewCount: 120
            },
            {
                title: "Bluetooth Speaker System",
                summary: "Powerful portable Bluetooth speaker with deep bass",
                description: "Enjoy your music anywhere with this powerful portable speaker. Features include 360-degree sound, waterproof design, and 20-hour battery life.",
                tags: ["electronics", "audio", "speaker"],
                category: categoryIds.speakers,
                supplier: userIds.sarahSpeaker,
                price: 149.99,
                count: 75,
                images: ["speaker-1.jpg", "speaker-2.jpg"],
                features: {
                    power: "40W",
                    batteryLife: "20 hours",
                    waterproof: "IPX7",
                    connectivity: ["Bluetooth 5.0", "AUX"]
                },
                averageRating: 4.3,
                reviewCount: 85
            },
            // Wearable Products
            {
                title: "Smart Fitness Watch",
                summary: "Advanced fitness tracking smartwatch with heart rate monitor",
                description: "Track your fitness goals with this advanced smartwatch. Features include heart rate monitoring, GPS tracking, sleep analysis, and water resistance up to 50m.",
                tags: ["electronics", "fitness", "wearable"],
                category: categoryIds.smartwatches,
                supplier: userIds.mikeWatch,
                price: 149.99,
                count: 75,
                images: ["watch-1.jpg", "watch-2.jpg"],
                features: {
                    display: "1.4 inch AMOLED",
                    batteryLife: "7 days",
                    waterResistance: "50m",
                    sensors: ["Heart Rate", "GPS", "Accelerometer"]
                },
                averageRating: 4.3,
                reviewCount: 85
            },
            {
                title: "Fitness Activity Tracker",
                summary: "Lightweight fitness tracker with advanced metrics",
                description: "Monitor your daily activities with this lightweight fitness tracker. Features include step counting, calorie tracking, and sleep monitoring.",
                tags: ["electronics", "fitness", "tracker"],
                category: categoryIds.fitnessTrackers,
                supplier: userIds.lisaFitness,
                price: 79.99,
                count: 100,
                images: ["tracker-1.jpg", "tracker-2.jpg"],
                features: {
                    batteryLife: "14 days",
                    waterResistance: "IP68",
                    display: "OLED",
                    sensors: ["Heart Rate", "SpO2"]
                },
                averageRating: 4.2,
                reviewCount: 65
            },
            // Computer Products
            {
                title: "Gaming Laptop Pro",
                summary: "High-performance gaming laptop with RTX graphics",
                description: "Experience gaming like never before with this powerful gaming laptop. Features include RTX graphics, high refresh rate display, and advanced cooling system.",
                tags: ["electronics", "computer", "gaming"],
                category: categoryIds.laptops,
                supplier: userIds.davidLaptop,
                price: 1499.99,
                count: 25,
                images: ["laptop-1.jpg", "laptop-2.jpg"],
                features: {
                    processor: "Intel i7-12700H",
                    graphics: "RTX 3070",
                    ram: "16GB DDR4",
                    storage: "1TB NVMe SSD"
                },
                averageRating: 4.7,
                reviewCount: 45
            },
            {
                title: "Professional Workstation",
                summary: "Powerful desktop workstation for professionals",
                description: "Boost your productivity with this professional workstation. Features include powerful CPU, high-end graphics, and expandable storage.",
                tags: ["electronics", "computer", "workstation"],
                category: categoryIds.desktops,
                supplier: userIds.emmaDesktop,
                price: 1999.99,
                count: 15,
                images: ["desktop-1.jpg", "desktop-2.jpg"],
                features: {
                    processor: "AMD Ryzen 9",
                    graphics: "RTX 3080",
                    ram: "32GB DDR4",
                    storage: "2TB NVMe SSD"
                },
                averageRating: 4.8,
                reviewCount: 30
            },
            // Gaming Products
            {
                title: "Next-Gen Gaming Console",
                summary: "Latest gaming console with 4K gaming support",
                description: "Experience next-gen gaming with this powerful console. Features include 4K gaming, ray tracing, and fast loading times.",
                tags: ["electronics", "gaming", "console"],
                category: categoryIds.gamingConsoles,
                supplier: userIds.alexGaming,
                price: 499.99,
                count: 40,
                images: ["console-1.jpg", "console-2.jpg"],
                features: {
                    storage: "1TB SSD",
                    resolution: "4K",
                    rayTracing: true,
                    backwardCompatibility: true
                },
                averageRating: 4.9,
                reviewCount: 150
            },
            {
                title: "Pro Gaming Mouse",
                summary: "Professional gaming mouse with customizable buttons",
                description: "Enhance your gaming performance with this professional gaming mouse. Features include customizable buttons, RGB lighting, and high-precision sensor.",
                tags: ["electronics", "gaming", "accessories"],
                category: categoryIds.gamingAccessories,
                supplier: userIds.sophieAccessories,
                price: 79.99,
                count: 100,
                images: ["mouse-1.jpg", "mouse-2.jpg"],
                features: {
                    dpi: "25600",
                    buttons: "8 programmable",
                    lighting: "RGB",
                    weight: "Adjustable"
                },
                averageRating: 4.6,
                reviewCount: 95
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
                { _id: userIds.johnAudio },
                { $push: { products: products[0]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.sarahSpeaker },
                { $push: { products: products[1]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.mikeWatch },
                { $push: { products: products[2]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.lisaFitness },
                { $push: { products: products[3]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.davidLaptop },
                { $push: { products: products[4]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.emmaDesktop },
                { $push: { products: products[5]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.alexGaming },
                { $push: { products: products[6]._id } }
            ),
            UserModel.updateOne(
                { _id: userIds.sophieAccessories },
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
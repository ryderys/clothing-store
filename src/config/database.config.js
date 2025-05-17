const { default: mongoose } = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const connectDB = async () => {
    try {
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };

        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://youssefiashkanys:Ashkanys79@first-project.co830.mongodb.net/?retryWrites=true&w=majority&appName=first-project', options);
        console.log("Connected to MongoDB successfully");

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

// mongoose.connect(process.env.MONGODB_URL).then(() => {
//     console.log("connected to DB");
// }).catch(err => {
//     console.log(err?.message ?? "failed to connect to DB");
// })

// mongoose.connect('mongodb+srv://youssefiashkanys:Ashkanys79@first-project.co830.mongodb.net/?retryWrites=true&w=majority&appName=first-project').then(() => {
//         console.log("connected DB");
//     }).catch(err => {
//         console.log(err);
//     })


const express = require("express");
const dotenv = require("dotenv")
const app = express();
const swaggerSetup = require("./src/config/swagger.config")
const path = require("path");
const mainRouter = require("./src/app.routes");
const { NotFoundHandler, AllExceptionHandler } = require("./src/common/utils/error.handler");
const cookieParser = require("cookie-parser");
// const session = require("express-session")
const cors = require("cors")
const adminRateLimiter = require("./src/common/middleware/rate-limit");
const { default: helmet } = require("helmet");
const connectDB = require("./src/config/database.config");

dotenv.config()

// Debug environment variables after loading
console.log("App startup - Environment check:", {
    NODE_ENV: process.env.NODE_ENV,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ? "SET" : "NOT SET",
    S3_ENDPOINT: process.env.S3_ENDPOINT ? "SET" : "NOT SET",
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY ? "SET" : "NOT SET",
    S3_SECRET_KEY: process.env.S3_SECRET_KEY ? "SET" : "NOT SET"
});

// Connect to MongoDB
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

app.use(helmet())
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
    ? ["https://clothing-store.liara.run", "https://fit-style-1.onrender.com","https://fit-style.pages.dev.com", "http://localhost:5173"]
    : "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
app.use(express.static(path.join(__dirname, "public")))

swaggerSetup(app)
// app.use(adminRateLimiter)
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({mongoUrl: process.env.MONGODB_URL}),
//     cookie: {
//         secure: process.env.NODE_ENV === "production",
//         maxAge: 1000 * 60 * 60 * 24, //1 day
//         httpOnly: true
//     }
// }))
app.use(mainRouter)

NotFoundHandler(app)
AllExceptionHandler(app)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/swagger`);
});

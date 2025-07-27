const multer = require("multer")
const path = require("path");
const fs = require("fs");
const HttpError = require("http-errors");
const s3 = require("../../config/aws");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

require("dotenv").config()

const storage = multer.memoryStorage();

const uploadFile = multer({
    storage,
    limits: {
        fileSize: 5 * 1000 * 1000 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const whiteListFormat = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
        if (whiteListFormat.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new HttpError.BadRequest("File format is not supported"));
        }
    }
});

// Helper function to upload file to S3
const uploadToS3 = async (file, folder = 'clothing-store-image/products') => {
    // Temporary debug to check environment variables
    console.log("S3 Environment check:", {
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
        S3_ENDPOINT: process.env.S3_ENDPOINT,
        S3_ACCESS_KEY: process.env.S3_ACCESS_KEY ? "SET" : "NOT SET",
        S3_SECRET_KEY: process.env.S3_SECRET_KEY ? "SET" : "NOT SET"
    });

    // Check if required environment variables are set
    if (!process.env.S3_BUCKET_NAME) {
        throw new HttpError.InternalServerError("S3 configuration error: Bucket name not provided");
    }
    
    if (!process.env.S3_ENDPOINT) {
        throw new HttpError.InternalServerError("S3 configuration error: Endpoint not provided");
    }

    if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
        throw new HttpError.InternalServerError("S3 configuration error: Credentials not provided");
    }

    const format = path.extname(file.originalname);
    if (!format) {
        throw new HttpError.BadRequest("Invalid file format");
    }

    const filename = `${Date.now()}${format}`;
    const key = `${folder}/${filename}`;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        return {
            key,
            url: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${key}`
        };
    } catch (error) {
        console.error("S3 upload error:", error);
        throw new HttpError.InternalServerError("Failed to upload file to S3");
    }
};

// Helper function to delete file from S3
const deleteFromS3 = async (key) => {
    // Check if required environment variables are set
    if (!process.env.S3_BUCKET_NAME) {
        throw new HttpError.InternalServerError("S3 configuration error: Bucket name not provided");
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: decodeURI(key)
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
        return true;
    } catch (error) {
        console.error("S3 delete error:", error);
        throw new HttpError.InternalServerError("Failed to delete file from S3");
    }
};

module.exports = {
    uploadFile,
    uploadToS3,
    deleteFromS3
}
        
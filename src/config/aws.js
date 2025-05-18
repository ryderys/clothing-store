const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config()



const s3Config = {
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
    endpoint: process.env.S3_ENDPOINT,
    region: "default", // Default to us-east-1 if not specified
    forcePathStyle: true // Required for some S3-compatible services
}

const s3 = new S3Client(s3Config)

module.exports = s3;
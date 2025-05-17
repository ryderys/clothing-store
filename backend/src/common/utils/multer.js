const multer = require("multer")
const path = require("path");
const fs = require("fs");
const HttpError = require("http-errors")


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(process.cwd(), "public", "upload")
      try {
        fs.mkdirSync(uploadPath, {recursive: true})
        cb(null, uploadPath);
      } catch (error) {
        cb(new HttpError.InternalServerError("failed to create upload directory"))
      }
    },

    filename: function (req, file, cb) {
      const whiteListFormat = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
      if(whiteListFormat.includes(file.mimetype)){
        const format = path.extname(file.originalname)
        if(!format){
          return cb(new HttpError.BadRequest("invalid file format"))
        }

        const filename = `${Date.now()}${format}`;
        cb(null, filename);
      }else {
        cb(new HttpError.BadRequest("File format is not supported"));
      }
    },
  });

  const uploadFile = multer({
    storage,
    limits: {
      fileSize: 10 * 1000 * 1000
    }
  })

module.exports = {
    uploadFile
}
        
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const newId = uuidv4();
// Require the cloudinary library
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: "dmnbwbb2q",
  api_key: "932834835575559",
  api_secret: "5MyJWn9XjjygDMVY8DTbcOqLWhg",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "sagar", // Specify the folder name here
    allowed_formats: ["jpg", "jpeg", "png"], // Specify the allowed file formats
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Apply transformations to the uploaded image
  },
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
        console.log("calllllll");
      cb(new Error("Only images are allowed."), false);
    }
  },
});
const upload = multer({ storage: storage });

module.exports = {
  upload,
};

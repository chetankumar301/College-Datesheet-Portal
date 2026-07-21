const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ensureConfigured = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary configuration is incomplete");
  }
};

const uploadBuffer = ({ buffer, folder, resourceType = "auto", publicId }) => {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

const deleteFile = async (publicId, resourceType = "image") => {
  if (!publicId) return null;
  ensureConfigured();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

module.exports = {
  uploadBuffer,
  deleteFile,
};

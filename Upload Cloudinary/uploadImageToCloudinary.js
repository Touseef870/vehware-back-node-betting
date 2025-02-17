import cloudinary from 'cloudinary';

const uploadImageToCloudinary = async ({ imageBuffer }) => {
    return Promise.all(
        imageBuffer.map(async (image) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { folder: `Product Images` },
                    (error, result) => {
                        if (error) {
                            reject(new Error('Error uploading image to Cloudinary.'));
                        } else {
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(image);
            });
        })
    )
};

export default uploadImageToCloudinary
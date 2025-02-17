import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Response from "../class/response.js";
import multer from "multer";


dotenv.config();

export async function verifyToken(req, res, next) {
    const response = new Response(res);

    const { authorization } = req.headers;
    if (!authorization) {
        return response.error({}, "Authorization header is missing");
    }

    const parts = authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return response.error({}, "Invalid token format");
    }

    const authToken = parts[1];

    try {
        let verified = jwt.verify(authToken, process.env.JWT_SECRET);

        req.user = verified;
        next();

    } catch (error) {
        const errorMsg = req.query.dev == 1 ? error?.message : 'Unauthorized';
        return response.error({}, errorMsg);
    }
}


const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).array("images", 20);


export function uploadMiddleware(req, res, next) {
    const response = new Response(res);

    upload(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                switch (err.code) {
                    case 'LIMIT_FILE_SIZE':
                        return response.error({}, 'Maximum file size is 10MB');
                    case 'LIMIT_FILE_COUNT':
                        return response.error({}, 'Maximum of 20 images allowed');
                    case 'LIMIT_UNEXPECTED_FILE':
                        return response.error({}, "Field name must be 'images'");
                    case 'INVALID_FILE_TYPE':
                        return response.error({}, 'Only image files are allowed');
                    default:
                        return response.error({}, `File upload error: ${err.message}`);
                }
            }
            return response.error({}, 'Error uploading files');
        }

        if (!req.files || req.files.length === 0) {
            return response.error({}, 'At least one image is required');
        }

        const invalidFiles = req.files.filter(file =>
            !file.mimetype.startsWith('image/')
        );

        if (invalidFiles.length > 0) {
            return response.error({}, 'Invalid file type detected');
        }

        next();
    });
}


export default verifyToken;
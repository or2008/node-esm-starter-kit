import cloudinary from 'cloudinary';
import { getCloudinaryApiKey, getCloudinaryApiSecret } from '../../config.js';

export function init() {
    cloudinary.v2.config({
        cloud_name: 'dfvtrlj7i',
        api_key: getCloudinaryApiKey(),
        api_secret: getCloudinaryApiSecret()
    });

    return cloudinary;
}


export const cloudinaryClient = init();
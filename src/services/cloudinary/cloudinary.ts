import cloudinary from 'cloudinary';

export function init() {
    cloudinary.v2.config({
        cloud_name: 'dfvtrlj7i',
        api_key: '948987747988156',
        api_secret: 'jaL7D3MYqbESGsz1LeJrk7TdO_I'
    });

    return cloudinary;
}


export const cloudinaryClient = init();
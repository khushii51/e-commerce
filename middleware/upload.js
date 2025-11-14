import multer from 'multer'
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads/'
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive: true});
    console.log('uploads/, folder created!');
}


const storage =multer.diskStorage({
    destination: (req, file, cb) =>{
         if (fs.existsSync(uploadDir)) {
            cb(null, uploadDir);
        } else {
            cb(new Error('Problem creating the folder!'), null);
        }
    },
    filename: (req, file, cb) => {
        if (!file.originalname) {
            return cb(new Error("File name incorrect!"), null);
        }

        const uniqueName = file.originalname
        cb(null, uniqueName);
    }
});



const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if(extname && mimetype){
        cb(null, true);
    }else{
        cb(new Error("Only images with .jpg, .jpeg, .png, .gif are allowed"), false)
    }
}


const upload = multer({
    storage, 
    fileFilter,
    limits: { fileSize: 10* 1024* 1024}
})
export default upload;
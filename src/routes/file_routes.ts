import express from "express";
const router = express.Router();
import multer from "multer";

const base = process.env.DOMAIN_BASE + "/";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext) // Appends the extension to the filename
    }
})
const upload = multer({ storage: storage });

router.post('/', upload.single("file"), function (req, res) {
    console.log("router.post(/file: " + base + req.file?.path)
    res.status(200).send({ url: base + req.file?.path })
});
export default upload.single('file');
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const base = process.env.DOMAIN_BASE + "/";
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.');
        cb(null, Date.now() + "." + ext); // Appends the extension to the filename
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post('/', upload.single("file"), function (req, res) {
    var _a, _b;
    console.log("router.post(/file: " + base + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path));
    res.status(200).send({ url: base + ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) });
});
exports.default = upload.single('file');
//# sourceMappingURL=file_routes.js.map
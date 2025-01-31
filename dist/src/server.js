"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const posts_routes_1 = __importDefault(require("./routes/posts_routes"));
const comments_routes_1 = __importDefault(require("./routes/comments_routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const file_routes_1 = __importDefault(require("./routes/file_routes"));
// Configure CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});
const delay = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((r) => setTimeout(() => r(), 500));
    next();
});
app.use("/posts", posts_routes_1.default);
app.use("/comments", comments_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/file", file_routes_1.default);
// Serve static files from the "public" directory
app.use(express_1.default.static('public'));
app.use('/uploads', express_1.default.static('uploads'));
app.get("/about", (req, res) => { res.send("About Page"); });
const initApp = () => {
    return new Promise((resolve, reject) => {
        const db = mongoose_1.default.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", function () { console.log("Connected to MongoDB"); });
        if (!process.env.DB_CONNECTION) {
            return reject("DB_CONNECT is not defined in .env file");
        }
        else {
            mongoose_1.default.connect(process.env.DB_CONNECTION).then(() => {
                return resolve(app);
            }).catch((err) => {
                return reject(err);
            });
        }
    });
};
//swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Web Dev 2025 REST API",
            version: "1.0.0",
            description: "REST server including JWT authentication",
        },
        servers: [{ url: "http://localhost:3000", },],
    },
    apis: ["./src/routes/*.ts"],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
exports.default = initApp;
//# sourceMappingURL=server.js.map
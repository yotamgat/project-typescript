"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const posts_routes_1 = __importDefault(require("./routes/posts_routes"));
const comments_routes_1 = __importDefault(require("./routes/comments_routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});
app.use("/posts", posts_routes_1.default);
app.use("/comments", comments_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.get("/about", (req, res) => { res.send("About Page"); });
//swagger
const options = {
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
const specs = (0, swagger_jsdoc_1.default)(options);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
const initApp = () => {
    return new Promise((resolve, reject) => {
        const db = mongoose_1.default.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", function () { console.log("Connected to MongoDB"); });
        if (!process.env.DB_CONNECTION) {
            reject("DB_CONNECT is not defined in .env file");
        }
        else {
            mongoose_1.default.connect(process.env.DB_CONNECTION).then(() => {
                resolve(app);
            }).catch((err) => {
                reject(err);
            });
        }
    });
};
exports.default = initApp;
//# sourceMappingURL=server.js.map
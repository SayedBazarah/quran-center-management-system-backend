"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// import { redisClient } from "./config/redis";
const routes_1 = require("./routes");
const session_1 = require("./config/session");
const passport_1 = require("./config/passport");
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:8083", "http://localhost:8088"], // your Next.js frontend
    credentials: true, // allow cookies
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)(process.env.NODE_ENV === "production" ? "combined" : "dev"));
// Serve Static Files
app.use(express_1.default.static("media"));
app.use("/media", express_1.default.static(path_1.default.join(process.cwd(), "media")));
// Session middleware must come before passport
app.use(session_1.sessionMiddleware);
app.use(...passport_1.initializePassport);
app.use("/api", routes_1.globalRoutes);
app.use(middlewares_1.notFound);
app.use(middlewares_1.errorHandler);
exports.default = app;

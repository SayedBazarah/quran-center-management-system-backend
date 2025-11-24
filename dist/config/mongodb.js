"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Establishes connection to MongoDB database
 * Uses mongoose with modern connection options
 */
// mongoose.connection.once("open", async () => {
//   try {
//     await mongoose.connection.db.collection("students").dropIndex("nationalId_1");
//     console.log("Unique phone index removed");
//   } catch (err) {
//     console.log("No unique index found on phone or already removed");
//   }
// });
const connectDB = async () => {
    try {
        // Connection options for stability and performance
        const options = {
            // useNewUrlParser: true,      // Deprecated in Mongoose 6+
            // useUnifiedTopology: true,   // Deprecated in Mongoose 6+
            maxPoolSize: 10, // Maximum number of connections
            serverSelectionTimeoutMS: 5000, // Timeout for server selection
            socketTimeoutMS: 45000, // Socket timeout
        };
        const conn = await mongoose_1.default.connect(env_1.env.mongoDb.uri, options);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        // Handle connection events
        mongoose_1.default.connection.on("error", (err) => {
            console.error(`❌ MongoDB connection error: ${err}`);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });
        // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose_1.default.connection.close();
            console.log("🔌 MongoDB connection closed through app termination");
            process.exit(0);
        });
    }
    catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error?.message}`);
        process.exit(1); // Exit with failure
    }
};
exports.default = connectDB;

import { env } from "@/env";
import mongoose from "mongoose";
/**
 * Establishes connection to MongoDB database
 * Uses mongoose with modern connection options
 */
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
        const conn = await mongoose.connect(env.mongoDb.uri, options);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        // Handle connection events
        mongoose.connection.on("error", (err) => {
            console.error(`❌ MongoDB connection error: ${err}`);
        });
        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });
        // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("🔌 MongoDB connection closed through app termination");
            process.exit(0);
        });
    }
    catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error?.message}`);
        process.exit(1); // Exit with failure
    }
};
export default connectDB;
//# sourceMappingURL=mongodb.js.map
import path from "path";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
// import { redisClient } from "./config/redis";
import { globalRoutes } from "./routes";
import { sessionMiddleware } from "./config/session";
import { initializePassport } from "@/config/passport";
import { errorHandler, notFound } from "./middlewares";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:8083", "http://localhost:8088"], // your Next.js frontend
    credentials: true, // allow cookies
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Serve Static Files
app.use(express.static("media"));
app.use("/media", express.static(path.join(process.cwd(), "media")));

// Session middleware must come before passport
app.use(sessionMiddleware);
app.use(...initializePassport);

app.use("/api", globalRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

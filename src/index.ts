import express, { Express, Request, Response } from "express";
import cors from "cors";
import { connect } from "mongoose";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import * as usersController from "./controllers/usersController";
import * as exerciseController from "./controllers/exerciseController";

// Load environment variables
dotenv.config();

// Constants
const PORT: number | string = process.env.PORT || 3000;
const MONGO_URI: string = process.env.MONGO_CONNECT_URI || "";

// Create Express app
const app: Express = express();

// Middleware
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

// API Request Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  headers: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/users", usersController.createNewUser);
app.get("/api/users/:_id", usersController.getUser);
app.get("/api/users/", usersController.getUsers);
app.post("/api/users/:_id/exercises", exerciseController.createExercise);
app.get("/api/users/:_id/logs", exerciseController.getExercises);

// Connect to MongoDB and start server
(async () => {
  try {
    await connect(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

export { app };
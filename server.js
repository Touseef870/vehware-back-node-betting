import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import Response from "./class/response.js";
import { cloudinaryConfig } from './Upload Cloudinary/index.js'
import axios from "axios";

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};


// ========================================================
// ===================== Initializing =====================
// ========================================================
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.set("port", process.env.PORT || 4000);

cloudinaryConfig();


// ========================================================
// ====================== Try Connect =====================
// ========================================================
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() =>
    console.log("---- Connected to MongoDB ----")
  )
  .catch((err) =>
    console.log("---- Error Connected MongoDB ----", err)
  );


// ========================================================
// ===================== If connected =====================
// ========================================================
const db = mongoose.connection;


// ========================================================
// =================== Mongoose Events ====================
// ========================================================
db.on("connected", () => {
  console.log("---- Mongoose connected to DB ----");
});

db.on("error", (err) => {
  console.log("---- Mongoose connection error ----", err);
});

db.on("disconnected", () => {
  console.log("---- Mongoose disconnected from DB ----");
});


// ========================================================
// ===================== Route Access =====================
// ========================================================
app.get("/", (req, res) => {
  const response = new Response(res);
  return response.success({}, 'Api is running successfully by Touseef Abid || Sharjeel Hussain 😁');
});


app.use("/api", routes);



app.all("*", (req, res) => {
  const response = new Response(res);
  return response.error({}, 'Trying route undefined ⚠️');
});


// ========================================================
// ==================== Listening Port ====================
// ========================================================
app.listen(app.get("port"), () =>
  console.log("Server started on port " + app.get("port"))
);
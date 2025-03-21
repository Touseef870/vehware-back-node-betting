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

app.get("/MatchInfo", async (req, res) => {
  const response = new Response(res);

  try {
    // Making the API request to CricBuzz API
    const res = await axios.get("https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live", {
      headers: {
        'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
        'x-rapidapi-key': '3eaf2cd0f6msh9f0419b7c6972ffp1ae7b9jsn851ea81fff04'
      }
    });

    // Return the data from CricBuzz API as the response
    // return res.json({
    //   message: "API is running successfully",
    //   data: response.data
    // });
    return response.success(res.data.typeMatches, 'API is running successfully');
  } catch (error) {

    const errorResponse = error.message ? error.message : error;

    // console.error(error);
    return response.error({}, errorResponse);
  }
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
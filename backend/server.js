import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import foodRoute from "./routes/food.js";


const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", foodRoute);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});

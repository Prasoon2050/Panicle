const { jwt } = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const apiRoutes = require("./routes/api");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/signupapp";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

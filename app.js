const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");

const mongoose = require("mongoose");
const HttpError = require("./models/httpError");

const checkAuth = require("./middleware/check-auth");

const authRouter = require("./routes/auth-route");
const jobRouter = require("./routes/job-route");

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());

app.use("/api/auth", authRouter);
app.use("/api/job", checkAuth, jobRouter);

app.use("/", (req, res, next) => {
  const error = new HttpError("Could not Found this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occur!" });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });

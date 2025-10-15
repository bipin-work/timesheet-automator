import express from "express";
import mongoose, { mongo } from "mongoose";
import routes from "./routes/index.mjs";

const app = express();

mongoose
  .connect("mongodb://localhost:27017/timesheet-automator")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Error", err));

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {
  console.log("Running on PORT::", PORT);
});

const dotenv = require("dotenv").config();
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const app = express();
const port = process.env.PORT || 3000;

// Database Connected
connectDb();

app.use(express.json());
app.use("/api", require("./routes/cardRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
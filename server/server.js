require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const errorHandler = require("./middleware/errorHandler");
// const { logger } = require("./middleware/logger");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");

const PORT = process.env.PORT || 5001;

connectDB();
// app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/rootRoute"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoute"));
app.use("/notes", require("./routes/noteRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running at ${PORT}`));
});

// mongoose.connection.on("error", (error) => {
//   console.log(error);
//   logEvents(`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`, "mongoErrorLog.log")
// });

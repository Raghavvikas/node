const express = require("express");
const notes = require("./data/notes.js");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

// const colors = require("colors");

const noteRoutes = require("./routes/noteRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const { errorHandler, notFound } = require("./middleware/errorMiddleware.js");

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017";

connectDB(DATABASE_URL);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.set("PORT", PORT || 5000);

app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json());
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

// app.use(
//   cors({
//     allowedHeaders: ["sessionId", "Content-Type", "master-token"],
//     exposedHeaders: ["sessionId"],
//     origin: "*",
//     methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
//     preflightContinue: false,
//   })
// );

// const __dirname = path.resolve();

// app.use((req, res, next) => {
//   next(createError(404));
// });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// app.get("/api/notes/", (req, resp) => {
//   const note = notes.find((n) => n._id === req.params.id);
//   resp.send(note);
// });

// app.listen(PORT, console.log(`Server started on ${PORT}`));

// --------------------------deployment------------------------------

// Error Handling middleWares
app.use(notFound);
app.use(errorHandler);

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}..`
  )
);

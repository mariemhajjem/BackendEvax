const express = require("express");
const app = express();
const cors = require("cors"); 

const DB = require("./config/DB");
const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/users-routes");
const centerRoutes = require("./routes/centers-routes");
const appointRoutes = require("./routes/appoint-routes");
const PORT = 5000;


app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/centers", centerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appoint", appointRoutes);

app.use((req, res, next) => {
  const error = new Error("could not found this route.");
  error.code = 404;
  throw error;
});

app.use((error, req, res, next) => {
  if (req.headerSent) return next(error);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknow error occured!" });
});

DB();
app.listen(PORT);
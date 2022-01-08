const express = require("express");
const app = express();
const cors = require("cors");
const nodeCron = require("node-cron");

const DB = require("./config/DB");
const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/users-routes");
const centerRoutes = require("./routes/centers-routes");
const pharmacyRoutes = require("./routes/pharmacies-routes");
const appointRoutes = require("./routes/appoint-routes");
const vaccinesRoutes = require("./routes/vaccines-routes");
const openDayRoutes = require("./routes/openDay-routes");





const { SendEmails } = require("./controllers/appoint-jobs");

const PORT = 5000;

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/centers", centerRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appoint", appointRoutes);
app.use("/api/vaccines", vaccinesRoutes);

app.use("/api/openday", openDayRoutes);




app.use((req, res, next) => {
  const error = new Error("could not found this route.");
  error.code = 404;
  throw error;
});

app.use((error, req, res, next) => {
  if (req.headerSent) return next(error);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknow error occured!", code:error.code });
});

DB();
// const job = nodeCron.schedule("*/1 * * * *", SendEmails); //every 2minutes
//const job = nodeCron.schedule("30 7 9 * * 6", SendEmails);//day 0 every sunday from 0-7
app.listen(PORT);

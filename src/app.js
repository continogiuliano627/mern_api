import express from "express";
import cors from "cors";
import userRoutes from "./routes/User.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;

import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 4001; //tengo ocupado el 4000
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mern_db";

(async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
})();

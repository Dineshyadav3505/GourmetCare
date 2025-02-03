import app from "./app";
import pool from "./db/dataConnection";

const startServer = async () => {
  try {
    await pool.connect();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();

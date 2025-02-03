import app from "./app";
import pool from "./db/dataConnection";


pool
  .connect()
  .then((client) => {
    console.log("Successfully connected to PostgreSQL database");
    client.release();
  })
  .catch((error) => {
    console.error("PostgreSQL Connection Error:", error);
    process.exit(1);
  });

app.on('error', (error) => {
    console.log("Error:", error);
    throw error;
});

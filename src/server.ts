import "dotenv/config";
import { app } from "./app.js";
import AppDataSource from "./database/data-source.js";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3300;

AppDataSource.initialize()
  .then(() => {
    app.listen({ port: PORT }, () => {
      console.log(`Server is running on http://localhost:${PORT} 🚀`);
    });
  })
  .catch((error) => console.log("Database Connection Error", error));

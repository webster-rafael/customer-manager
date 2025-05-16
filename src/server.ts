import "dotenv/config";
import { app } from "./app";
import AppDataSource from "./database/data-source";

AppDataSource.initialize()
  .then(() => {
    app.listen({ port: 3300 }, () => {
      console.log("Server is running on http://localhost:3300 🚀");
    });
  })
  .catch((error) => console.log("Database Connection Error", error));

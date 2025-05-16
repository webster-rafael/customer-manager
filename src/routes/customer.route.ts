// src/routes/customer.routes.ts
import { FastifyInstance } from "fastify";
import { verifyJwt } from "../middleware/auth.middleware";
import { listCustomersController } from "../controllers/customers.controller";

export async function customerRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);

  app.get("/", listCustomersController);
}

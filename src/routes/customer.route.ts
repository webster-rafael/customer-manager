import { FastifyInstance } from "fastify";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  createCustomerController,
  deleteCustomerController,
  listCustomersController,
  updateCustomerController,
} from "../controllers/customers.controller.js";
import { CreateCustomers } from "../interface/customer.interface";

export async function customerRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);

  app.post<{ Body: CreateCustomers }>("/", createCustomerController);

  app.get("/", listCustomersController);

  app.put("/:id", updateCustomerController);

  app.delete("/:id", deleteCustomerController);
}

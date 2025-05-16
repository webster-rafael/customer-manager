import { FastifyInstance } from "fastify";
import { verifyJwt } from "../middleware/auth.middleware";
import {
  createCustomerController,
  listCustomersController,
} from "../controllers/customers.controller";
import { CustomersUseCase } from "../usecases/customers.usecase";
import { CreateCustomers } from "../interface/customer.interface";

export async function customerRoutes(app: FastifyInstance) {
  const customerUseCase = new CustomersUseCase();
  app.addHook("onRequest", verifyJwt);

  app.post<{ Body: CreateCustomers }>("/", createCustomerController);

  app.get("/", listCustomersController);
}

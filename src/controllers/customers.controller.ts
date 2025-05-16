// src/controllers/customer.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { CustomerTypeOrmRepository } from "../repositories/customer.typeorm.repository";
import { CustomersUseCase } from "../usecases/customers.usecase";

export async function listCustomersController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const customerRepo = new CustomerTypeOrmRepository();
  const useCase = new CustomersUseCase(customerRepo);

  const customers = await useCase.findAll();
  return reply.status(200).send(customers);
}

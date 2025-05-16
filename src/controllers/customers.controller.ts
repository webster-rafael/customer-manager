import { FastifyRequest, FastifyReply } from "fastify";
import { CustomersUseCase } from "../usecases/customers.usecase";
import { CreateCustomers } from "../interface/customer.interface";

export async function listCustomersController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const customerUseCase = new CustomersUseCase();
  const customers = await customerUseCase.findAll();
  return reply.status(200).send(customers);
}

export async function createCustomerController(
  request: FastifyRequest<{ Body: CreateCustomers }>,
  reply: FastifyReply
) {
  const useCase = new CustomersUseCase();
  const data = await useCase.create(request.body);
  return reply.status(201).send(data);
}

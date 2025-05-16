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

export async function updateCustomerController(
  request: FastifyRequest<{ Params: { id: string }; Body: CreateCustomers }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const data = request.body;

  try {
    const useCase = new CustomersUseCase();
    const updatedCustomer = await useCase.update(id, data);
    reply.code(200).send(updatedCustomer);
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

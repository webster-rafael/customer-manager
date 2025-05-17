import { FastifyRequest, FastifyReply } from "fastify";
import { CustomersUseCase } from "../usecases/customers.usecase";
import { CreateCustomers } from "../interface/customer.interface";

export async function listCustomersController(
  request: FastifyRequest,
  reply: FastifyReply,
  useCase?: CustomersUseCase
) {
  const uc = useCase ?? new CustomersUseCase();

  try {
    const customers = await uc.findAll();
    return reply.code(200).send(customers);
  } catch (error) {
    return reply.code(500).send({ message: "Error fetching customers" });
  }
}

export async function createCustomerController(
  request: FastifyRequest<{ Body: CreateCustomers }>,
  reply: FastifyReply,
  useCase?: CustomersUseCase
) {
  const uc = useCase ?? new CustomersUseCase();

  try {
    const newCustomer = await uc.create(request.body);
    return reply.code(201).send(newCustomer);
  } catch (error) {
    return reply
      .code(400)
      .send({ message: (error as Error).message || "Error creating customer" });
  }
}

export async function updateCustomerController(
  request: FastifyRequest<{ Params: { id: string }; Body: CreateCustomers }>,
  reply: FastifyReply,
  useCase?: CustomersUseCase
) {
  const uc = useCase ?? new CustomersUseCase();

  try {
    const updatedCustomer = await uc.update(request.params.id, request.body);
    return reply.code(200).send(updatedCustomer);
  } catch (error) {
    return reply
      .code(400)
      .send({ message: (error as Error).message || "Error updating customer" });
  }
}

export async function deleteCustomerController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
  useCase?: CustomersUseCase
) {
  const uc = useCase ?? new CustomersUseCase();

  try {
    await uc.delete(request.params.id);
    return reply.code(204).send();
  } catch (error) {
    console.error(`Error deleting customer`, error);
    return reply
      .code(400)
      .send({ message: (error as Error).message || "Error deleting customer" });
  }
}

export async function verifyEmailExistsController(
  request: FastifyRequest<{ Params: { email: string } }>,
  reply: FastifyReply,
  useCase?: CustomersUseCase
) {
  const uc = useCase ?? new CustomersUseCase();
  try {
    const emailExists = await uc.verifyIfEmailExists(request.params.email);
    return reply.code(200).send({ exists: emailExists });
  } catch (error) {
    return reply.code(400).send({
      message: error instanceof Error ? error.message : "Error creating customer",
    });
  }
}

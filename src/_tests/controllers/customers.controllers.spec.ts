import { FastifyRequest, FastifyReply } from "fastify";
import { CustomersUseCase } from "../../../src/usecases/customers.usecase";
import {
  listCustomersController,
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
  verifyEmailExistsController,
} from "../../../src/controllers/customers.controller";
import { CreateCustomers } from "../../../src/interface/customer.interface";

jest.mock("../../../src/usecases/customers.usecase");

describe("Customers Controllers", () => {
  let mockFindAll: jest.Mock;
  let mockCreate: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockDelete: jest.Mock;
  let mockVerify: jest.Mock;

  beforeEach(() => {
    mockFindAll = jest.fn();
    mockCreate = jest.fn();
    mockUpdate = jest.fn();
    mockDelete = jest.fn();
    mockVerify = jest.fn();

    (CustomersUseCase as jest.Mock).mockImplementation(() => ({
      findAll: mockFindAll,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
      verifyIfEmailExists: mockVerify,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 200 e lista de clientes", async () => {
    const mockCustomers = [{ id: "1", name: "João" }];
    mockFindAll.mockResolvedValue(mockCustomers);

    const request = {} as FastifyRequest;
    const send = jest.fn();
    const reply = { code: jest.fn().mockReturnValue({ send }) } as unknown as FastifyReply;

    await listCustomersController(request, reply);

    expect(mockFindAll).toHaveBeenCalled();
    expect(reply.code).toHaveBeenCalledWith(200);
    expect(send).toHaveBeenCalledWith(mockCustomers);
  });

  it("deve criar cliente e retornar 201", async () => {
    const newCust = { name: "Carlos" } as CreateCustomers & { id: string };
    mockCreate.mockResolvedValue(newCust);

    const request = { body: { name: "Carlos" } } as FastifyRequest<{ Body: CreateCustomers }>;
    const send = jest.fn();
    const reply = { code: jest.fn().mockReturnValue({ send }) } as unknown as FastifyReply;

    await createCustomerController(request, reply);

    expect(mockCreate).toHaveBeenCalledWith(request.body);
    expect(reply.code).toHaveBeenCalledWith(201);
    expect(send).toHaveBeenCalledWith(newCust);
  });

  it("deve retornar 400 se create lançar", async () => {
    mockCreate.mockRejectedValue(new Error("Email já cadastrado"));

    const request = { body: { name: "Dup" } } as FastifyRequest<{ Body: CreateCustomers }>;
    const send = jest.fn();
    const reply = { code: jest.fn().mockReturnValue({ send }) } as unknown as FastifyReply;

    await createCustomerController(request, reply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith({ message: "Email já cadastrado" });
  });

  it("deve atualizar cliente e retornar 200", async () => {
    const updated = { id: "1", name: "Upd" };
    mockUpdate.mockResolvedValue(updated);

    const request = {
      params: { id: "1" },
      body: { name: "Upd" },
    } as FastifyRequest<{ Params: { id: string }; Body: CreateCustomers }>;
    const send = jest.fn();
    const reply = { code: jest.fn().mockReturnValue({ send }) } as unknown as FastifyReply;

    await updateCustomerController(request, reply);

    expect(mockUpdate).toHaveBeenCalledWith("1", request.body);
    expect(reply.code).toHaveBeenCalledWith(200);
    expect(send).toHaveBeenCalledWith(updated);
  });

  it("deve retornar 400 se update lançar", async () => {
    mockUpdate.mockRejectedValue(new Error("Error updating customer"));

    const request = {
      params: { id: "x" },
      body: { name: "Nope" },
    } as FastifyRequest<{ Params: { id: string }; Body: CreateCustomers }>;
    const send = jest.fn();
    const reply = { code: jest.fn().mockReturnValue({ send }) } as unknown as FastifyReply;

    await updateCustomerController(request, reply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith({ message: "Error updating customer" });
  });

  it("deve deletar cliente e retornar 204", async () => {
    mockDelete.mockResolvedValue(undefined);

    const request = { params: { id: "1" } } as FastifyRequest<{ Params: { id: string } }>;
    const send = jest.fn();
    const reply = { code: jest.fn().mockReturnValue({ send }) } as unknown as FastifyReply;

    await deleteCustomerController(request, reply);

    expect(mockDelete).toHaveBeenCalledWith("1");
    expect(reply.code).toHaveBeenCalledWith(204);
    expect(send).toHaveBeenCalled();
  });

  it("deve retornar 400 se delete lançar", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockDelete.mockRejectedValue(new Error("Error deleting customer"));

    const request = { params: { id: "x" } } as FastifyRequest<{ Params: { id: string } }>;
    const send = jest.fn();
    const reply = { code: jest.fn().mockReturnValue({ send }) } as unknown as FastifyReply;

    await deleteCustomerController(request, reply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith({ message: "Error deleting customer" });
  });

  it("deve verificar email e retornar 200 com exists=true", async () => {
    mockVerify.mockResolvedValue(true);
    const request = { params: { email: "a@b.com" } } as FastifyRequest<{ Params: { email: string } }>;
    const send = jest.fn();
    const reply = { code: jest.fn().mockReturnValue({ send }) } as unknown as FastifyReply;

    await verifyEmailExistsController(request, reply);

    expect(mockVerify).toHaveBeenCalledWith("a@b.com");
    expect(reply.code).toHaveBeenCalledWith(200);
    expect(send).toHaveBeenCalledWith({ exists: true });
  });

  it("deve retornar 400 se verifyEmailExists lançar", async () => {
    mockVerify.mockRejectedValue(new Error("fail"));
    const request = { params: { email: "x@x.com" } } as FastifyRequest<{ Params: { email: string } }>;
    const send = jest.fn();
    const reply = { code: jest.fn().mockReturnValue({ send }) } as unknown as FastifyReply;

    await verifyEmailExistsController(request, reply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith({ message: "fail" });
  });
});

jest.mock("../../../src/usecases/customers.usecase");
import { FastifyRequest, FastifyReply } from "fastify";
import { CustomersUseCase } from "../../../src/usecases/customers.usecase";
import {
  listCustomersController,
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
} from "../../controllers/customers.controller";
import { CreateCustomers } from "../../../src/interface/customer.interface";

describe("Customers Controllers", () => {
  let mockFindAll: jest.Mock;
  let mockCreate: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockDelete: jest.Mock;

  let useCaseInstance: CustomersUseCase;

  beforeEach(() => {
    mockFindAll = jest.fn();
    mockCreate = jest.fn();
    mockUpdate = jest.fn();
    mockDelete = jest.fn();

    (CustomersUseCase as jest.Mock).mockImplementation(() => ({
      findAll: mockFindAll,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    }));

    useCaseInstance = new CustomersUseCase();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 200 e uma lista de clientes", async () => {
    const mockCustomers = [
      { id: 1, name: "João" },
      { id: 2, name: "Maria" },
    ];
    mockFindAll.mockResolvedValue(mockCustomers);

    const request = {} as FastifyRequest;
    const sendMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ send: sendMock });
    const reply = { code: statusMock } as unknown as FastifyReply;

    await listCustomersController(request, reply, useCaseInstance);

    expect(mockFindAll).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith(mockCustomers);
  });

  it("deve criar um cliente e retornar 201", async () => {
    const newCustomer = { id: "uuid", name: "Carlos" };
    mockCreate.mockResolvedValue(newCustomer);

    const request = {
      body: { name: "Carlos" },
    } as FastifyRequest<{ Body: CreateCustomers }>;

    const sendMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ send: sendMock });
    const reply = { code: statusMock } as unknown as FastifyReply;

    await createCustomerController(request, reply, useCaseInstance);

    expect(mockCreate).toHaveBeenCalledWith(request.body);
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(sendMock).toHaveBeenCalledWith(newCustomer);
  });

  it("deve atualizar um cliente e retornar 200", async () => {
    const updatedCustomer = { id: "uuid", name: "Updated" };
    mockUpdate.mockResolvedValue(updatedCustomer);

    const request = {
      params: { id: "uuid" },
      body: { name: "Updated" },
    } as FastifyRequest<{ Params: { id: string }; Body: CreateCustomers }>;

    const sendMock = jest.fn();
    const codeMock = jest.fn().mockReturnValue({ send: sendMock });
    const reply = { code: codeMock } as unknown as FastifyReply;

    await updateCustomerController(request, reply, useCaseInstance);

    expect(mockUpdate).toHaveBeenCalledWith("uuid", request.body);
    expect(codeMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith(updatedCustomer);
  });

  it("deve retornar erro 400 ao atualizar cliente não existente", async () => {
    mockUpdate.mockRejectedValue(new Error("Error updating customer"));

    const request = {
      params: { id: "invalid-uuid" },
      body: { name: "Nope" },
    } as FastifyRequest<{ Params: { id: string }; Body: CreateCustomers }>;

    const sendMock = jest.fn();
    const codeMock = jest.fn().mockReturnValue({ send: sendMock });
    const reply = { code: codeMock } as unknown as FastifyReply;

    await updateCustomerController(request, reply, useCaseInstance);

    expect(mockUpdate).toHaveBeenCalledWith("invalid-uuid", request.body);
    expect(codeMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({
      message: "Error updating customer",
    });
  });

  it("deve deletar um cliente e retornar 204", async () => {
    mockDelete.mockResolvedValue(undefined);

    const request = {
      params: { id: "uuid" },
    } as FastifyRequest<{ Params: { id: string } }>;

    const sendMock = jest.fn();
    const codeMock = jest.fn().mockReturnValue({ send: sendMock });
    const reply = { code: codeMock } as unknown as FastifyReply;

    await deleteCustomerController(request, reply, useCaseInstance);

    expect(mockDelete).toHaveBeenCalledWith("uuid");
    expect(codeMock).toHaveBeenCalledWith(204);
    expect(sendMock).toHaveBeenCalled();
  });

  it("deve retornar erro 400 ao deletar cliente não existente", async () => {
  // silencia console.error só aqui
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  mockDelete.mockRejectedValue(new Error("Error deleting customer"));

  const request = {
    params: { id: "invalid-uuid" },
  } as FastifyRequest<{ Params: { id: string } }>;

  const sendMock = jest.fn();
  const codeMock = jest.fn().mockReturnValue({ send: sendMock });
  const reply = { code: codeMock } as unknown as FastifyReply;

  await deleteCustomerController(request, reply, useCaseInstance);

  expect(mockDelete).toHaveBeenCalledWith("invalid-uuid");
  expect(codeMock).toHaveBeenCalledWith(400);
  expect(sendMock).toHaveBeenCalledWith({
    message: "Error deleting customer",
  });

  // restaura o console.error depois do teste
  consoleErrorSpy.mockRestore();
});

});

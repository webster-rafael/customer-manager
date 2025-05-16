import { CustomersUseCase } from "../../usecases/customers.usecase";
import {
  CustomerRepository,
  CreateCustomers,
} from "../../interface/customer.interface";

describe("CustomersUseCase", () => {
  let useCase: CustomersUseCase;
  let mockCustomerRepo: jest.Mocked<CustomerRepository>;

  const fakeCustomers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      address: {
        street: "Rua A",
        number: "1",
        neighborhood: "Centro",
        city: "SP",
        state: "SP",
        zip_code: "00000-000",
      },
    },
  ];

  beforeEach(() => {
    mockCustomerRepo = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(), // Corrigido aqui (antes estava 'mockUpdate = jest.fn()')
    };
    useCase = new CustomersUseCase(mockCustomerRepo);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar a lista de clientes em caso de sucesso", async () => {
    mockCustomerRepo.findAll.mockResolvedValue(fakeCustomers);

    const result = await useCase.findAll();

    expect(result).toEqual(fakeCustomers);
    expect(mockCustomerRepo.findAll).toHaveBeenCalled();
  });

  it("deve lançar erro e registrar quando o repositório lançar em findAll", async () => {
    const error = new Error("DB failure");
    mockCustomerRepo.findAll.mockRejectedValue(error);

    await expect(useCase.findAll()).rejects.toThrow("Error fetching customers");
    expect(mockCustomerRepo.findAll).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.any(Error));
  });

  it("deve criar cliente com sucesso", async () => {
    const newCustomer: CreateCustomers = {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "987654321",
      address: {
        street: "Rua B",
        number: "2",
        neighborhood: "Bairro",
        city: "SP",
        state: "SP",
        zip_code: "11111-111",
      },
    };

    const createdCustomer = { id: "2", ...newCustomer };
    mockCustomerRepo.create.mockResolvedValue(createdCustomer as any);

    const result = await useCase.create(newCustomer);

    expect(result).toEqual(createdCustomer);
    expect(mockCustomerRepo.create).toHaveBeenCalledWith(newCustomer);
  });

  it("deve lançar erro ao tentar criar cliente", async () => {
    const newCustomer: CreateCustomers = {
      name: "Erro",
      email: "erro@example.com",
      phone: "000000000",
      address: {
        street: "Rua C",
        number: "3",
        neighborhood: "Erro",
        city: "SP",
        state: "SP",
        zip_code: "22222-222",
      },
    };

    const error = new Error("DB insert error");
    mockCustomerRepo.create.mockRejectedValue(error);

    await expect(useCase.create(newCustomer)).rejects.toThrow(
      "Error creating customer"
    );
    expect(mockCustomerRepo.create).toHaveBeenCalledWith(newCustomer);
    expect(console.log).toHaveBeenCalledWith(error);
  });

  // Novos testes para update

  it("deve atualizar cliente com sucesso", async () => {
    const updateData: CreateCustomers = {
      name: "Maria Updated",
      email: "maria.updated@example.com",
      phone: "999999999",
      address: {
        street: "Rua D",
        number: "4",
        neighborhood: "Novo Bairro",
        city: "SP",
        state: "SP",
        zip_code: "33333-333",
      },
    };

    const updatedCustomer = { id: "1", ...updateData };
    mockCustomerRepo.update.mockResolvedValue(updatedCustomer as any);

    const result = await useCase.update("1", updateData);

    expect(result).toEqual(updatedCustomer);
    expect(mockCustomerRepo.update).toHaveBeenCalledWith("1", updateData);
  });

  it("deve lançar erro ao tentar atualizar cliente", async () => {
    const updateData: CreateCustomers = {
      name: "Falha Update",
      email: "fail.update@example.com",
      phone: "000000000",
      address: {
        street: "Rua Fail",
        number: "0",
        neighborhood: "Erro Bairro",
        city: "SP",
        state: "SP",
        zip_code: "00000-000",
      },
    };

    const error = new Error("DB update error");
    mockCustomerRepo.update.mockRejectedValue(error);

    await expect(useCase.update("1", updateData)).rejects.toThrow(
      "Error updating customer"
    );
    expect(mockCustomerRepo.update).toHaveBeenCalledWith("1", updateData);
    expect(console.log).toHaveBeenCalledWith(error);
  });
});

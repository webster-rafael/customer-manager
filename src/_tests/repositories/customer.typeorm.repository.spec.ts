import AppDataSource from "../../database/data-source";
import { Customer } from "../../entity/Customer";
import { CustomerTypeOrmRepository } from "../../repositories/customer.typeorm.repository";

describe("CustomerTypeOrmRepository", () => {
  let repo: CustomerTypeOrmRepository;
  let mockFind: jest.Mock;
  let mockSave: jest.Mock;
  let mockCreate: jest.Mock;
  let mockFindOneBy: jest.Mock;
  let mockRemove: jest.Mock;

  const fixedDate = new Date("2024-01-01T00:00:00Z");

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(fixedDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    repo = new CustomerTypeOrmRepository();

    mockFind = jest.fn();
    mockSave = jest.fn();
    mockCreate = jest.fn();
    mockFindOneBy = jest.fn();
    mockRemove = jest.fn();

    jest.spyOn(AppDataSource, "getRepository").mockReturnValue({
      find: mockFind,
      create: mockCreate,
      save: mockSave,
      findOneBy: mockFindOneBy,
      remove: mockRemove,
    } as any);

    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar uma lista de clientes", async () => {
    const fakeCustomers: Customer[] = [
      {
        id: "uuid-1",
        name: "Fulano",
        email: "fulano@example.com",
        phone: "123456789",
        address: {
          street: "Rua Sem Saída",
          number: "100",
          neighborhood: "Centro",
          city: "Cidade",
          state: "Estado",
          zip_code: "12345-678",
        },
        active: true,
        created_at: fixedDate,
        updated_at: fixedDate,
      },
    ];

    mockFind.mockResolvedValue(fakeCustomers);

    const customers = await repo.findAll();

    expect(customers).toEqual(fakeCustomers);
    expect(AppDataSource.getRepository).toHaveBeenCalledWith(Customer);
    expect(mockFind).toHaveBeenCalled();
  });

  it("deve lançar erro quando findAll lança", async () => {
    mockFind.mockRejectedValue(new Error("DB error"));

    await expect(repo.findAll()).rejects.toThrow("Error fetching customers");
    expect(AppDataSource.getRepository).toHaveBeenCalledWith(Customer);
    expect(mockFind).toHaveBeenCalled();
  });

  it("deve criar um cliente com sucesso", async () => {
    const newCustomerData = {
      name: "Maria",
      email: "maria@example.com",
      phone: "987654321",
      address: {
        street: "Rua B",
        number: "200",
        neighborhood: "Bairro",
        city: "Cidade",
        state: "Estado",
        zip_code: "87654-321",
      },
      active: true,
      created_at: fixedDate,
      updated_at: fixedDate,
    };

    const createdCustomer = {
      id: "uuid-2",
      ...newCustomerData,
    } as Customer;

    mockCreate.mockReturnValue(createdCustomer);
    mockSave.mockResolvedValue(createdCustomer);

    const result = await repo.create(newCustomerData);

    expect(mockCreate).toHaveBeenCalledWith(newCustomerData);
    expect(mockSave).toHaveBeenCalledWith(createdCustomer);
    expect(result).toEqual(createdCustomer);
  });

  it("deve lançar erro ao criar cliente", async () => {
    const newCustomerData = {
      name: "Maria",
      email: "maria@example.com",
      phone: "987654321",
      address: {
        street: "Rua B",
        number: "200",
        neighborhood: "Bairro",
        city: "Cidade",
        state: "Estado",
        zip_code: "87654-321",
      },
      active: true,
      created_at: fixedDate,
      updated_at: fixedDate,
    };

    mockCreate.mockReturnValue(newCustomerData as any);
    mockSave.mockRejectedValue(new Error("DB save error"));

    await expect(repo.create(newCustomerData as any)).rejects.toThrow(
      "Error creating customer"
    );
    expect(console.log).toHaveBeenCalled();
  });

  it("deve atualizar cliente com sucesso", async () => {
    const id = "uuid-1";
    const updateData = {
      name: "João Atualizado",
      email: "joao@atualizado.com",
      phone: "111222333",
      address: {
        street: "Rua Atualizada",
        number: "123",
        neighborhood: "Centro",
        city: "Cidade",
        state: "Estado",
        zip_code: "99999-999",
      },
      active: true,
    };

    const existingCustomer = {
      id,
      name: "João",
      email: "joao@exemplo.com",
      phone: "123456789",
      address: {
        street: "Rua Antiga",
        number: "100",
        neighborhood: "Centro",
        city: "Cidade",
        state: "Estado",
        zip_code: "12345-678",
      },
      active: true,
      created_at: fixedDate,
      updated_at: fixedDate,
    } as Customer;

    const updatedCustomer = {
      ...existingCustomer,
      ...updateData,
      updated_at: fixedDate,
    } as Customer;

    mockFindOneBy.mockResolvedValue(existingCustomer);
    mockSave.mockResolvedValue(updatedCustomer);

    const result = await repo.update(id, updateData as any);

    expect(mockFindOneBy).toHaveBeenCalledWith({ id });
    expect(mockSave).toHaveBeenCalledWith(updatedCustomer);
    expect(result).toEqual(updatedCustomer);
  });

  it("deve lançar erro quando atualizar cliente não encontrado", async () => {
    mockFindOneBy.mockResolvedValue(null);

    await expect(repo.update("invalid-id", {} as any)).rejects.toThrow(
      "Error updating customer"
    );
    expect(mockFindOneBy).toHaveBeenCalledWith({ id: "invalid-id" });
  });

  it("deve deletar cliente com sucesso", async () => {
    const existingCustomer = { id: "uuid-1" } as Customer;
    mockFindOneBy.mockResolvedValue(existingCustomer);
    mockRemove.mockResolvedValue(undefined);

    await expect(repo.delete("uuid-1")).resolves.toBeUndefined();

    expect(mockFindOneBy).toHaveBeenCalledWith({ id: "uuid-1" });
    expect(mockRemove).toHaveBeenCalledWith(existingCustomer);
  });

  it("deve lançar erro quando deletar cliente não encontrado", async () => {
    mockFindOneBy.mockResolvedValue(null);

    await expect(repo.delete("invalid-id")).rejects.toThrow(
      "Error deleting customer"
    );
    expect(mockFindOneBy).toHaveBeenCalledWith({ id: "invalid-id" });
  });

  it("deve retornar true se email existir", async () => {
    mockFindOneBy.mockResolvedValue({} as Customer);
    const exists = await repo.verifyIfEmailExists("test@example.com");
    expect(exists).toBe(true);
    expect(mockFindOneBy).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  it("deve retornar false se email não existir", async () => {
    mockFindOneBy.mockResolvedValue(null);
    const exists = await repo.verifyIfEmailExists("test@example.com");
    expect(exists).toBe(false);
    expect(mockFindOneBy).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  it("deve lançar erro se verificar email falhar", async () => {
    mockFindOneBy.mockRejectedValue(new Error("DB error"));
    await expect(repo.verifyIfEmailExists("test@example.com")).rejects.toThrow(
      "Error verifying email"
    );
    expect(mockFindOneBy).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  it("deve retornar um cliente pelo email", async () => {
    const email = "joao@example.com";
    const fakeCustomer = {
      id: "uuid-123",
      name: "João",
      email,
      phone: "999888777",
      address: {
        street: "Rua XPTO",
        number: "123",
        neighborhood: "Bairro",
        city: "Cidade",
        state: "Estado",
        zip_code: "00000-000",
      },
      active: true,
      created_at: fixedDate,
      updated_at: fixedDate,
    } as Customer;

    mockFindOneBy.mockResolvedValue(fakeCustomer);

    const result = await repo.findByEmail(email);

    expect(result).toEqual(fakeCustomer);
    expect(mockFindOneBy).toHaveBeenCalledWith({ email });
  });

  it("deve retornar null se cliente com email não for encontrado", async () => {
    mockFindOneBy.mockResolvedValue(null);

    const result = await repo.findByEmail("naoexiste@example.com");

    expect(result).toBeNull();
    expect(mockFindOneBy).toHaveBeenCalledWith({
      email: "naoexiste@example.com",
    });
  });

  it("deve lançar erro se ocorrer falha ao buscar por email", async () => {
    mockFindOneBy.mockRejectedValue(new Error("DB error"));

    await expect(repo.findByEmail("erro@example.com")).rejects.toThrow(
      "Error finding customer by email"
    );

    expect(mockFindOneBy).toHaveBeenCalledWith({ email: "erro@example.com" });
  });
});

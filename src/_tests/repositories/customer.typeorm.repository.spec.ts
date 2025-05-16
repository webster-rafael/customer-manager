import AppDataSource from "../../database/data-source";
import { Customer } from "../../entity/Customer";
import { CustomerTypeOrmRepository } from "../../repositories/customer.typeorm.repository";

describe("CustomerTypeOrmRepository", () => {
  let repo: CustomerTypeOrmRepository;
  let mockFind: jest.Mock;
  let mockSave: jest.Mock;
  let mockCreate: jest.Mock;
  let mockFindOneBy: jest.Mock;

  beforeEach(() => {
    repo = new CustomerTypeOrmRepository();

    mockFind = jest.fn();
    mockSave = jest.fn();
    mockCreate = jest.fn();
    mockFindOneBy = jest.fn();

    jest.spyOn(AppDataSource, "getRepository").mockReturnValue({
      find: mockFind,
      create: mockCreate,
      save: mockSave,
      findOneBy: mockFindOneBy,
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
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        address: {
          street: "Rua A",
          number: "100",
          neighborhood: "Centro",
          city: "Cidade",
          state: "Estado",
          zip_code: "12345-678",
        },
      },
    ];

    mockFind.mockResolvedValue(fakeCustomers);

    const customers = await repo.findAll();

    expect(customers).toEqual(fakeCustomers);
    expect(AppDataSource.getRepository).toHaveBeenCalledWith(Customer);
    expect(mockFind).toHaveBeenCalled();
  });

  it("deve lançar erro quando find lança", async () => {
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
    };

    const createdCustomer = {
      id: "uuid-2",
      ...newCustomerData,
    };

    mockCreate.mockReturnValue(createdCustomer);
    mockSave.mockResolvedValue(createdCustomer);

    const result = await repo.create(newCustomerData as any);

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
    };

    mockCreate.mockReturnValue(newCustomerData);
    mockSave.mockRejectedValue(new Error("DB save error"));

    await expect(repo.create(newCustomerData as any)).rejects.toThrow(
      "Error creating customer"
    );
  });

  it("deve atualizar um cliente com sucesso", async () => {
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
    };

    const updatedCustomer = { ...existingCustomer, ...updateData };

    mockFindOneBy.mockResolvedValue(existingCustomer);
    mockSave.mockResolvedValue(updatedCustomer);

    const result = await repo.update(id, updateData as any);

    expect(mockFindOneBy).toHaveBeenCalledWith({ id });
    expect(mockSave).toHaveBeenCalledWith(updatedCustomer);
    expect(result).toEqual(updatedCustomer);
  });

  it("deve lançar erro se o cliente a ser atualizado não for encontrado", async () => {
    const id = "uuid-invalido";
    const updateData = {
      name: "Nome Qualquer",
      email: "email@qualquer.com",
      phone: "000000000",
      address: {
        street: "Rua Qualquer",
        number: "0",
        neighborhood: "Bairro",
        city: "Cidade",
        state: "Estado",
        zip_code: "00000-000",
      },
    };

    mockFindOneBy.mockResolvedValue(null);

    await expect(repo.update(id, updateData as any)).rejects.toThrow(
      "Error updating customer"
    );

    expect(mockFindOneBy).toHaveBeenCalledWith({ id });
  });
});

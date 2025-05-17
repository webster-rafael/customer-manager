import { Customer } from "../entity/Customer";
import {
  CreateCustomers,
  CustomerRepository,
} from "../interface/customer.interface";
import { CustomerTypeOrmRepository } from "../repositories/customer.typeorm.repository";

export class CustomersUseCase {
  private customerRepo: CustomerRepository;
  constructor(customerRepo?: CustomerRepository) {
    this.customerRepo = customerRepo ?? new CustomerTypeOrmRepository();
  }

  async create({
    name,
    email,
    phone,
    address,
    active,
  }: CreateCustomers): Promise<Customer> {
    try {
      const emailExists = await this.verifyIfEmailExists(email);
      if (emailExists) {
        throw new Error("Email já cadastrado");
      }

      return await this.customerRepo.create({
        name,
        email,
        phone,
        address,
        active,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Email já cadastrado") {
        throw error;
      }
      console.log(error);
      throw new Error("Error creating customer");
    }
  }

  async findAll() {
    try {
      const data = await this.customerRepo.findAll();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching customers");
    }
  }

  async update(id: string, data: CreateCustomers): Promise<Customer> {
    try {
      const customer = await this.customerRepo.update(id, data);
      return customer;
    } catch (error) {
      console.log(error);
      throw new Error("Error updating customer");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.customerRepo.delete(id);
    } catch (error) {
      console.log(error);
      throw new Error("Error deleting customer");
    }
  }

  async verifyIfEmailExists(email: string): Promise<boolean> {
    try {
      const customer = await this.customerRepo.verifyIfEmailExists(email);
      return customer;
    } catch (error) {
      console.log(error);
      throw new Error(
        (error as Error).message || "Error finding customer by email"
      );
    }
  }
}

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
      const data = await this.customerRepo.create({
        name,
        email,
        phone,
        address,
        active,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return data;
    } catch (error) {
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
}

import AppDataSource from "../database/data-source";
import { Customer } from "../entity/Customer";
import {
  CreateCustomers,
  CustomerRepository,
} from "../interface/customer.interface";

export class CustomerTypeOrmRepository implements CustomerRepository {
  async create({
    name,
    email,
    phone,
    address,
    active,
    created_at,
    updated_at,
  }: CreateCustomers): Promise<Customer> {
    try {
      const repo = AppDataSource.getRepository(Customer);
      const customer = repo.create({
        name,
        email,
        phone,
        address,
        active,
        created_at,
        updated_at,
      });
      await repo.save(customer);
      return customer;
    } catch (error) {
      console.log(error);
      throw new Error("Error creating customer");
    }
  }

  async findAll(): Promise<Customer[]> {
    try {
      const data = await AppDataSource.getRepository(Customer).find();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching customers");
    }
  }

  async findByEmail(email: string): Promise<Customer | null> {
    try {
      const repo = AppDataSource.getRepository(Customer);
      const customer = await repo.findOneBy({ email });
      return customer ?? null;
    } catch (error) {
      console.log(error);
      throw new Error("Error finding customer by email");
    }
  }

  async update(id: string, data: CreateCustomers): Promise<Customer> {
    try {
      const repo = AppDataSource.getRepository(Customer);
      const customer = await repo.findOneBy({ id });
      if (!customer) {
        throw new Error("Customer not found");
      }
      customer.name = data.name ?? customer.name;
      customer.email = data.email ?? customer.email;
      customer.phone = data.phone ?? customer.phone;
      customer.active = data.active ?? customer.active;
      customer.address = data.address ?? customer.address;
      customer.updated_at = new Date();
      await repo.save(customer);
      return customer;
    } catch (error) {
      console.log(error);
      throw new Error("Error updating customer");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const repo = AppDataSource.getRepository(Customer);
      const customer = await repo.findOneBy({ id });
      if (!customer) {
        throw new Error("Customer not found");
      }
      await repo.remove(customer);
    } catch (error) {
      console.log(error);
      throw new Error("Error deleting customer");
    }
  }

  async verifyIfEmailExists(email: string): Promise<boolean> {
    try {
      const repo = AppDataSource.getRepository(Customer);
      const customer = await repo.findOneBy({ email });
      return !!customer;
    } catch (error) {
      console.log(error);
      throw new Error("Error verifying email");
    }
  }
}

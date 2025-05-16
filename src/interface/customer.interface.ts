import { Customer } from "../entity/Customer";

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface CreateCustomers {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface CustomerRepository {
  create(data: CreateCustomers): Promise<Customer>;
  findAll(): Promise<Customer[]>;
  update(id: string, data: CreateCustomers): Promise<Customer>;
  delete(id: string): Promise<void>;
}

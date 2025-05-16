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
  active: boolean;
  address: Address;
  created_at?: Date;
  updated_at?: Date;
}

export interface CustomerRepository {
  create(data: CreateCustomers): Promise<Customer>;
  findAll(): Promise<Customer[]>;
  update(id: string, data: CreateCustomers): Promise<Customer>;
  delete(id: string): Promise<void>;
}

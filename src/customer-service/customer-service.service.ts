import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CustomerService,
  CustomerServiceDocument,
  CustomerServiceSchema,
} from '../Schemas/customerService.schema';
import { Model } from 'mongoose';
import { CustomerServiceDto } from './dto/customerService.dto';

@Injectable()
export class CustomerServiceService {
  constructor(
    @InjectModel(CustomerService.name)
    private readonly customerModel: Model<CustomerServiceDocument>,
  ) {}

  async createCustomerQuery(
    customerServiceDto: CustomerServiceDto,
  ): Promise<CustomerServiceDocument> {
    const customerQuery = await this.customerModel.create(customerServiceDto);
    return customerQuery;
  }

  async getAllQueries(): Promise<CustomerServiceDocument[]> {
    return this.customerModel.find();
  }

  async getSingleQuery(queryId): Promise<CustomerServiceDocument> {
    return this.customerModel.findById({ _id: queryId });
  }

  async editQuery(queryId, data): Promise<CustomerServiceDocument> {
    const query = await this.customerModel.findByIdAndUpdate(
      { _id: queryId },
      {
        $set: {
          customerQuery: data.customerQuery,
        },
      },
    );
    return query;
  }

  async deleteQuery(queryId): Promise<CustomerServiceDocument> {
    return this.customerModel.findByIdAndDelete({ _id: queryId });
  }
}

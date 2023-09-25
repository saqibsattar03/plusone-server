import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CustomerService,
  CustomerServiceDocument,
} from '../../data/schemas/customer-service.schema';
import { Model } from 'mongoose';
import { CustomerServiceDto } from '../../data/dtos/customer-service.dto';
import { AwsMailUtil } from '../../common/utils/aws-mail-util';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class CustomerServiceService {
  constructor(
    @InjectModel(CustomerService.name)
    private readonly customerModel: Model<CustomerServiceDocument>,
    private readonly profileService: ProfilesService,
  ) {}

  async createCustomerQuery(
    customerServiceDto: CustomerServiceDto,
  ): Promise<CustomerServiceDocument> {
    console.log(customerServiceDto);
    const res = await this.customerModel.create(customerServiceDto);
    const user = await this.profileService.getUserFields(res.userId);
    //*** send email for low balance ***//
    const templateData = {
      subject: res.subject,
      type: 'this is test type',
      name: user.email,
      message: res.message,
    };
    await new AwsMailUtil().sendEmail(
      'saqibsattar710@gmail.com',
      templateData,
      'CustomerSupport',
    );
    return res;
  }

  async getAllQueries(): Promise<CustomerServiceDocument[]> {
    return this.customerModel.find().populate({
      path: 'userId',
      select: 'email firstname surname contactNumber -_id',
    });
  }

  async getSingleQuery(queryId): Promise<CustomerServiceDocument> {
    return this.customerModel.findById({ _id: queryId }).populate({
      path: 'userId',
      select: 'email firstname surname contactNumber -_id',
    });
  }

  async editQuery(queryId, data): Promise<CustomerServiceDocument> {
    return this.customerModel.findByIdAndUpdate(
      { _id: queryId },
      {
        $set: {
          message: data.message,
          contactNumber: data.contactNumber,
        },
      },
    );
  }

  async deleteQuery(queryId): Promise<CustomerServiceDocument> {
    return this.customerModel.findByIdAndDelete({ _id: queryId });
  }
}

import { Module } from '@nestjs/common';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomerService,
  CustomerServiceSchema,
} from '../../data/schemas/customerService.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CustomerService.name,
        schema: CustomerServiceSchema,
      },
    ]),
  ],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService],
})
export class CustomerServiceModule {}

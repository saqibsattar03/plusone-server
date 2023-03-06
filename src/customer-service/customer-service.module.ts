import { Module } from '@nestjs/common';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomerService,
  CustomerServiceSchema,
} from '../Schemas/customerService.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CustomerService.name,
        schema: CustomerServiceSchema,
      },
    ]),
    MulterModule.register({
      dest: '../uploads',
    }),
  ],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService],
})
export class CustomerServiceModule {}

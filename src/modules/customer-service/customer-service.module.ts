import { Module } from '@nestjs/common';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomerService,
  CustomerServiceSchema,
} from '../../data/schemas/customer-service.schema';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CustomerService.name,
        schema: CustomerServiceSchema,
      },
    ]),
    ProfilesModule,
  ],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService],
})
export class CustomerServiceModule {}

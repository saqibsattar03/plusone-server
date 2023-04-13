import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DepositMoney,
  DepositMoneyDocument,
} from '../../data/schemas/deposit-money.schema';
import mongoose, { Model } from 'mongoose';
import { DepositMoneyDto } from '../../data/dtos/deposit-money.dto';
import * as moment from 'moment';
import {
  PaymentDetail,
  paymentDetailDocument,
} from '../../data/schemas/payment-detail.schema';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class DepositMoneyService {
  constructor(
    @InjectModel(DepositMoney.name)
    private readonly depositMoneyModel: Model<DepositMoneyDocument>,
    @InjectModel(PaymentDetail.name)
    private readonly paymentDetailModel: Model<paymentDetailDocument>,
    private readonly restaurantService: RestaurantService,
  ) {}

  async deposit(depositDto: DepositMoneyDto, restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    const res = await this.depositMoneyModel.findOne({
      restaurantId: oid,
    });
    if (!res) {
      const restaurant = await this.depositMoneyModel.create({
        restaurantId: restaurantId,
      });
      await restaurant.updateOne({
        $push: {
          depositObject: {
            amount: depositDto.depositObject.amount,
            createdAt: moment().format('YYYY-MM-DD'),
          },
        },
      });
      await this.restaurantService.depositMoney(
        restaurantId,
        depositDto.depositObject.amount,
      );
      throw new HttpException('Money Deposited Successfully', HttpStatus.OK);
    } else {
      await res.updateOne({
        $push: {
          depositObject: {
            amount: depositDto.depositObject.amount,
            createdAt: moment().format('YYYY-MM-DD'),
          },
        },
      });
      await this.restaurantService.depositMoney(
        restaurantId,
        depositDto.depositObject.amount,
      );
      throw new HttpException('Money Deposited Successfully', HttpStatus.OK);
    }
  }

  async sumOfDepositedAmountOfSingleRestaurant(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    return this.depositMoneyModel.aggregate([
      {
        $match: {
          restaurantId: oid,
        },
      },
      {
        $unwind: '$depositObject',
      },
      {
        $group: {
          _id: restaurantId,
          totalAmount: {
            $sum: { $sum: '$depositObject.amount' },
          },
        },
      },
    ]);
  }

  async sumOfDepositedAmountOfAllRestaurant(): Promise<any> {
    return this.depositMoneyModel.aggregate([
      {
        $unwind: '$depositObject',
      },
      {
        $group: {
          _id: null,
          totalDebit: {
            $sum: { $sum: '$depositObject.amount' },
          },
        },
      },
    ]);
  }
}

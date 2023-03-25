import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DepositMoney,
  DepositMoneyDocument,
} from '../../data/schemas/deposit-money.schema';
import mongoose, { Model } from 'mongoose';
import { DepositMoneyDto } from '../../data/dtos/deposit-money.dto';
import * as moment from 'moment';

@Injectable()
export class DepositMoneyService {
  constructor(
    @InjectModel(DepositMoney.name)
    private readonly depositMoney: Model<DepositMoneyDocument>,
  ) {}

  async deposit(depositDto: DepositMoneyDto, restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    const res = await this.depositMoney.findOne({
      restaurantId: oid,
    });
    if (!res) {
      const restaurant = await this.depositMoney.create({
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
      throw new HttpException('Money Deposited Successfully', HttpStatus.OK);
    }
  }

  async sumOfDepositedAmount(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    return this.depositMoney.aggregate([
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
}

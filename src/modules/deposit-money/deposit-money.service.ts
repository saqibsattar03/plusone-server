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
import { TransactionHistoryService } from '../transaction-history/transaction-history.service';
import { Constants } from '../../common/constants';

@Injectable()
export class DepositMoneyService {
  constructor(
    @InjectModel(DepositMoney.name)
    private readonly depositMoneyModel: Model<DepositMoneyDocument>,
    @InjectModel(PaymentDetail.name)
    private readonly paymentDetailModel: Model<paymentDetailDocument>,
    private readonly restaurantService: RestaurantService,
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}

  async deposit(depositDto: DepositMoneyDto, restaurantId): Promise<any> {
    const update = {
      $push: {
        depositObject: {
          amount: depositDto.depositObject.amount,
          createdAt: moment().format('YYYY-MM-DD hh:mm:ss'),
        },
      },
    };

    const options = {
      upsert: true,
      new: true,
    };

    await this.depositMoneyModel.findOneAndUpdate(
      { restaurantId: restaurantId },
      update,
      options,
    );

    const res = await this.restaurantService.depositMoney(
      restaurantId,
      depositDto.depositObject.amount,
    );

    const data = {
      restaurantId: restaurantId,
      transactionType: Constants.CREDIT,
      amount: depositDto.depositObject.amount,
      availableDeposit: res.availableDeposit,
    };

    await this.transactionHistoryService.createTransactionHistory(data);
    throw new HttpException('Money Deposited Successfully', HttpStatus.OK);
  }

  async sumOfDepositedAmountBySingleRestaurant(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    const totalDebit = await this.depositMoneyModel
      .findOne({ oid })
      .then((deposits) => {
        return deposits.depositObject.reduce((sum, depositObj) => {
          return sum + Number(depositObj.amount);
        }, 0);
      });
    return { totalDebit: totalDebit };
  }

  async sumOfDepositedAmountByAllRestaurant(): Promise<any> {
    return this.depositMoneyModel.find({}).then((deposits) => {
      const totalDebit = deposits.reduce((total, deposit) => {
        console.log(total);
        return (
          total +
          deposit.depositObject.reduce((sum, depositObj) => {
            return sum + Number(depositObj.amount);
          }, 0)
        );
      }, 0);
      return { totalDebit: totalDebit };
    });
  }
}

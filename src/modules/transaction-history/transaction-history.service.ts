import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TransactionHistory,
  TransactionHistoryDocument,
} from '../../data/schemas/transactionHistory.schema';
import mongoose, { Model } from 'mongoose';
import { PdfReportUtil } from '../../common/utils/pdf-report.util';

@Injectable()
export class TransactionHistoryService {
  constructor(
    @InjectModel(TransactionHistory.name)
    private readonly transactionHistoryModel: Model<TransactionHistoryDocument>,
  ) {}
  async createTransactionHistory(data: any): Promise<any> {
    return this.transactionHistoryModel.create(data);
  }

  async getRestaurantTransactionHistory(
    restaurantId: string,
    type: string,
  ): Promise<TransactionHistoryDocument[]> {
    if (type && restaurantId) {
      return this.transactionHistoryModel.find({
        restaurantId: restaurantId,
        transactionType: type,
      });
    } else if (restaurantId && !type) {
      const res = await this.transactionHistoryModel
        .find({
          restaurantId: restaurantId,
        })
        .populate({
          path: 'restaurantId',
          select:
            'restaurantName phoneNumber locationName availableDeposit totalDeposit totalDeductions createdAt',
        });
      return res;
    } else return this.transactionHistoryModel.find();
  }

  async generateInvoice(
    restaurantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const res = await this.transactionHistoryModel
      .find({
        restaurantId: new mongoose.Types.ObjectId(restaurantId),
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .populate({
        path: 'restaurantId',
        select:
          'restaurantName phoneNumber locationName availableDeposit totalDeposit totalDeductions createdAt',
      });
    if (!res.length)
      throw new HttpException(
        'No Data Between Chosen Dates Found',
        HttpStatus.BAD_REQUEST,
      );
    await new PdfReportUtil().createInvoice(res);
    return res;
  }
}

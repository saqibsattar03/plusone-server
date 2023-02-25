import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher, VoucherDocument } from '../../Schemas/voucher.schema';
import mongoose, { Model } from 'mongoose';
import { VoucherDto } from './dto/voucher.dto';
import { RestaurantDocument } from '../../Schemas/restaurant.schema';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name)
    private readonly voucherModel: Model<VoucherDocument>,
  ) {}

  async createVoucher(voucherDto: VoucherDto): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherDto.restaurantId);
    const voucher = await this.voucherModel.create({
      restaurantId: oid,
      voucherCode: voucherDto.voucherCode,
      voucherType: voucherDto.voucherType,
      discount: voucherDto.discount,
    });
    return voucher;
  }

  async getAllVouchesByRestaurant(restaurantId): Promise<any> {
    const allVouchers = await this.voucherModel
      .find({
        restaurantId: restaurantId,
      })
      .exec();
    console.log('res = ', allVouchers);
    return allVouchers;
  }
  async editVoucher(voucherId, data): Promise<any> {
    const voucher = await this.voucherModel.findOneAndUpdate(
      { _id: voucherId },
      {
        $set: {
          discount: data.discount,
          text: data.text,
          voucherType: data.voucherType,
          voucherCode: data.voucherCode,
        },
      },
    );
  }

  async deleteVoucher(voucherId) {
    return this.voucherModel.findByIdAndDelete({ _id: voucherId });
  }
}

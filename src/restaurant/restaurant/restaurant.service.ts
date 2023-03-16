import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantDocument,
} from '../../Schemas/restaurant.schema';
import mongoose, { Model } from 'mongoose';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import {
  RedeemVoucher,
  RedeemVoucherDocument,
} from '../../Schemas/redeemVoucher.schema';
import {
  RestaurantReview,
  RestaurantReviewDocument,
} from '../../Schemas/restaurantReview.schema';
import { Voucher, VoucherDocument } from '../../Schemas/voucher.schema';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
    @InjectModel(RedeemVoucher.name)
    private readonly redeemVoucherModel: Model<RedeemVoucherDocument>,

    @InjectModel(Voucher.name)
    private readonly voucherModel: Model<VoucherDocument>,

    @InjectModel(RestaurantReview.name)
    private readonly restaurantReviewModel: Model<RestaurantReviewDocument>,
  ) {}

  async createRestaurant(
    restaurantDto: CreateRestaurantDto,
  ): Promise<RestaurantDocument> {
    return this.restaurantModel.create(restaurantDto);
  }

  async getAllRestaurants(): Promise<any> {
    return this.restaurantModel.find();
  }

  async getRestaurantById(restaurantId): Promise<RestaurantDocument> {
    return this.restaurantModel.findById({ _id: restaurantId });
  }

  async editRestaurant(restaurantId, data): Promise<RestaurantDocument> {
    return this.restaurantModel.findByIdAndUpdate(
      { _id: restaurantId },
      {
        $set: {
          phoneNumber: data.phoneNumber,
          menu: data.menu,
          description: data.description,
          location: data.location,
          tags: data.tags,
          dietaryRestrictions: data.dietaryRestrictions,
          culinaryOptions: data.culinaryOptions,
          isSponsored: data.isSponsored,
        },
      },
    );
  }

  async deleteRestaurant(restaurantId): Promise<any> {
    await this.restaurantReviewModel.findOneAndDelete({
      restaurantId: restaurantId,
    });
    await this.restaurantModel.findByIdAndDelete({ _id: restaurantId });
    await this.voucherModel.findOneAndDelete({
      restaurantId: restaurantId,
    });
  }

  async getUserWhoRedeemVoucher(voucherId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherId);
    return this.redeemVoucherModel.find({ voucherId: oid });
  }
}

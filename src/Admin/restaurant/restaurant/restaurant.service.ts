import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantDocument,
} from '../../../Schemas/restaurant.schema';
import mongoose, { Model } from 'mongoose';
import { RestaurantDto } from './dto/create-restaurant.dto';
import {
  RedeemVoucher,
  RedeemVoucherDocument,
} from '../../../Schemas/redeemVoucher.schema';
import {
  RestaurantReview,
  RestaurantReviewDocument,
} from '../../../Schemas/restaurantReview.schema';
import { Voucher, VoucherDocument } from '../../../Schemas/voucher.schema';
import { PaginationDto } from '../../../common/dto/pagination.dto';

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
    restaurantDto: RestaurantDto,
  ): Promise<RestaurantDocument> {
    return this.restaurantModel.create(restaurantDto);
  }

  async getAllRestaurants(paginationDto: PaginationDto): Promise<any> {
    const { limit, offset } = paginationDto;
    return this.restaurantModel.find().limit(limit).skip(offset);
  }
  async getRestaurantById(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    return this.restaurantModel.aggregate([
      {
        $match: {
          _id: oid,
        },
      },
      {
        $lookup: {
          from: 'vouchers',
          localField: '_id',
          foreignField: 'restaurantId',
          as: 'voucher',
        },
      },
      {
        $unwind: '$voucher',
      },
      {
        $lookup: {
          from: 'restaurantreviews',
          localField: '_id',
          foreignField: 'restaurantId',
          as: 'review',
        },
      },
      {
        $unwind: {
          path: '$review',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'redeemvouchers',
          localField: '_id',
          foreignField: 'restaurantId',
          as: 'redeemedVoucher',
        },
      },
      {
        $project: {
          restaurantName: '$restaurantName',
          profileImage: '$profileImage',
          reviews: {
            $ifNull: ['$review', null],
          },
          vouchers: '$voucher.voucherObject',
          media: '$media',
          redeemedVouchers: '$redeemedVoucher',
        },
      },
    ]);
  }
  async getRestaurantVouchers(restaurantId): Promise<any> {
    return this.voucherModel.findOne({ restaurantId: restaurantId });
  }
  async getRestaurantReviews(restaurantId): Promise<any> {
    return this.restaurantReviewModel.findOne({ restaurantId: restaurantId });
  }
  async editRestaurant(restaurantId, data): Promise<RestaurantDocument> {
    return this.restaurantModel.findByIdAndUpdate(
      { _id: restaurantId },
      {
        $set: {
          restaurantName: data.restaurantName,
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
    await this.restaurantReviewModel.findOneAndDelete({
      restaurantId: restaurantId,
    });
  }

  async getUserWhoRedeemVoucher(voucherId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(voucherId);
    return this.redeemVoucherModel.find({ voucherId: oid });
  }

  async changeRestaurantStatus(restaurantId, status): Promise<any> {
    await this.restaurantModel.findByIdAndUpdate(
      { _id: restaurantId },
      { status: status.toUpperCase() },
    );
  }
}

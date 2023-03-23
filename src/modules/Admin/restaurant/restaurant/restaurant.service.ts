import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantDocument,
} from '../../../../data/schemas/restaurant.schema';
import mongoose, { Model } from 'mongoose';
import { RestaurantDto } from '../../../../data/dtos/restaurant.dto';
import { PaginationDto } from '../../../../common/auth/dto/pagination.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
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
  async getSingleRestaurantDetails(restaurantId): Promise<any> {
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

  async getSingleRestaurant(restaurantId): Promise<any> {
    await this.restaurantModel.findOne({
      _id: restaurantId,
    });
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

  async changeRestaurantStatus(restaurantId, status): Promise<any> {
    await this.restaurantModel.findByIdAndUpdate(
      { _id: restaurantId },
      { status: status.toUpperCase() },
    );
  }

  async getRestaurantUniqueCode(restaurantId): Promise<any> {
    return this.restaurantModel
      .findOne({ _id: restaurantId })
      .select('uniqueCode -_id');
  }

  async getRestaurantReviewCount(restaurantId): Promise<any> {
    return this.restaurantModel
      .findOne({ _id: restaurantId })
      .lean()
      .select('reviewCount -_id');
  }

  async updateReviewCount(restaurantId, reviewCount): Promise<any> {
    return this.restaurantModel.findOneAndUpdate(
      { _id: restaurantId },
      { reviewCount: reviewCount },
    );
  }

  async getRestaurantVerificationCode(restaurantId): Promise<any> {
    return this.restaurantModel
      .findOne({
        _id: restaurantId,
      })
      .select('uniqueCode -_id');
  }

  async nearByCuisineFilter(
    cuisines,
    tags,
    nearest,
    longitude,
    latitude,
  ): Promise<any> {
    // if (!cuisines && !tags)
    //   throw new HttpException(
    //     'You must select tags or cuisine in order to apply search filter',
    //     HttpStatus.BAD_REQUEST,
    //   );
    const METERS_PER_MILE = 1609.34;
    const query = [];
    let maxDistance;
    let sort;

    if (cuisines) {
      const culinaryOptions = {
        culinaryOptions: { $in: cuisines },
      };
      query.push(culinaryOptions);
    }
    if (tags) {
      const tag = {
        tags: { $in: tags },
      };
      query.push(tag);
    }
    if (nearest) {
      maxDistance = 10;
      sort = -1;
    }
    // return this.restaurantModel.find({
    //   location: {
    //     $near: {
    //       $geometry: {
    //         type: 'Point',
    //         coordinates: [parseFloat(longitude), parseFloat(latitude)],
    //       },
    //       // $distanceField: 'distanceFromMe',
    //       $maxDistance: maxDistance ?? 100 * METERS_PER_MILE, //!*** distance in meters ***!//
    //       // $distanceMultiplier: 1 / 1609.34,
    //       // spherical: true,
    //     },
    //     // $geoNear: {
    //     //   $near: {
    //     //     type: 'Point',
    //     //     coordinates: [parseFloat(longitude), parseFloat(latitude)],
    //     //   },
    //     //   $maxDistance: maxDistance ?? 100 * METERS_PER_MILE,
    //     // },
    //   },
    // });
    return this.restaurantModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distanceFromMe',
          maxDistance: maxDistance ?? 100 * METERS_PER_MILE, //!*** distance in meters ***!//
          distanceMultiplier: 1 / 1609.34,
          spherical: true,
        },
      },
      {
        $match: {
          $or: query,
        },
      },
      { $unset: ['verificationCode', 'uniqueCode'] },
      { $sort: { location: sort ?? 1 } },
    ]);
  }
}

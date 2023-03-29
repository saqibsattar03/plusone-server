import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantDocument,
} from '../../data/schemas/restaurant.schema';
import mongoose, { Model } from 'mongoose';
import { RestaurantDto } from '../../data/dtos/restaurant.dto';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profileService: ProfilesService,
  ) {}

  async createRestaurant(restaurantDto: RestaurantDto): Promise<any> {
    console.log('restaurant data ::', restaurantDto);
    let uniqueCode = Math.floor(Math.random() * 5596 + 1249);
    const codeCheck = await this.restaurantModel.findOne({
      uniqueCode: uniqueCode,
    });
    console.log(uniqueCode);
    if (codeCheck) {
      uniqueCode = Math.floor(Math.random() * 5596 + 1249);
    }
    const user = await this.profileService.createUser(restaurantDto);
    restaurantDto.userId = user._id;
    restaurantDto.uniqueCode = uniqueCode;
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

  async getRestaurantProfile(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    return this.restaurantModel.findById(oid);
  }
  async editRestaurant(restaurantId, data): Promise<RestaurantDocument> {
    // const res = await this.restaurantModel.findById({ _id: restaurantId });
    // const user = await this.profileService.updateProfile(data, res.userId);
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
          status: data.status,
          isSponsored: data.isSponsored,
        },
      },
      { returnDocument: 'after' },
    );
  }

  // async changeRestaurantStatus(restaurantId, status): Promise<any> {
  //   const oid = new mongoose.Types.ObjectId(restaurantId);
  //   return this.restaurantModel.findOneAndUpdate(
  //     { userId: oid },
  //     { status: status.toUpperCase() },
  //     { returnDocument: 'after' },
  //   );
  // }

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

  async getRestaurantVerificationCode(
    restaurantId,
    restaurantCode,
  ): Promise<any> {
    return this.restaurantModel
      .findOne({
        _id: restaurantId,
        uniqueCode: restaurantCode,
      })
      .select('uniqueCode -_id');
  }

  async restaurantFilters(data, paginationQuery): Promise<any> {
    const { limit, offset } = paginationQuery;
    const METERS_PER_MILE = 1609.34;
    const query = [];
    let maxDistance;
    let sort;
    let pipeline;

    if (data.cuisine) {
      console.log('inside', data.cuisine);
      const cuisine = {
        culinaryOptions: { $in: data.cuisine },
      };
      query.push(cuisine);
    }
    if (data.tags) {
      const tag = {
        tags: { $in: data.tags },
      };
      query.push(tag);
    }
    if (data.dietaryRestrictions) {
      const diet = {
        dietaryRestrictions: { $in: data.dietaryRestrictions },
      };
      query.push(diet);
    }
    console.log(query);
    if (data.nearest) {
      maxDistance = 1609.34 * 2;
      sort = -1;
    }
    if (
      !data.cuisine &&
      !data.tags &&
      !data.nearest &&
      !data.longitude &&
      !data.latitude &&
      !data.dietaryRestrictions
    ) {
      return this.restaurantModel
        .find()
        .skip(offset)
        .limit(limit)
        .sort({ isSponsored: -1 });
    } else {
      if (data.latitude && data.longitude) {
        pipeline = [
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [
                  parseFloat(data.longitude),
                  parseFloat(data.latitude),
                ],
              },
              distanceField: 'distanceFromMe',
              maxDistance: maxDistance ?? 100 * METERS_PER_MILE, //!*** distance in meters ***!//
              distanceMultiplier: 1 / 1609.34,
              spherical: true,
            },
          },
        ];
      }
      if (query.length > 0) {
        if (pipeline) {
          pipeline = [
            ...pipeline,
            {
              $match: {
                $or: query,
              },
            },
          ];
        } else {
          pipeline = [
            {
              $match: {
                $or: query,
              },
            },
          ];
        }
      }
      pipeline = [
        ...pipeline,
        { $unset: ['verificationCode', 'uniqueCode'] },
        { $skip: offset },
        { $limit: limit },
        { $sort: { location: sort ?? 1 } },
      ];
      return this.restaurantModel.aggregate(pipeline);
    }
  }
  async dietFilter(dietaryRestrictions: [string]): Promise<any> {
    return this.restaurantModel.aggregate([
      {
        $unwind: '$dietaryRestrictions',
      },
      {
        $match: {
          dietaryRestrictions: {
            $in: dietaryRestrictions,
          },
        },
      },
    ]);
  }

  async filterPopularRestaurant(): Promise<any> {
    return this.restaurantModel.aggregate([
      {
        $lookup: {
          from: 'redeemvouchers',
          localField: '_id',
          foreignField: 'restaurantId',
          as: 'restaurant',
        },
      },
      {
        $match: {
          'restaurant.0': { $exists: true },
        },
      },
      {
        $count: 'count',
      },
      // { $group: { _id: '$restaurantName', popularity: { $sum: 1 } } },
      {
        $unset: ['restaurant.uniqueCode', 'restaurant.verificationCode'],
      },
      { $sort: { popularity: -1 } },
    ]);
  }
}

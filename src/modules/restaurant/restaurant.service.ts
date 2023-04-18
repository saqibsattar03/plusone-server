import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Restaurant,
  RestaurantDocument,
} from '../../data/schemas/restaurant.schema';
import mongoose, { Model } from 'mongoose';
import { RestaurantDto } from '../../data/dtos/restaurant.dto';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';
import { ProfilesService } from '../profiles/profiles.service';
import * as moment from 'moment';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profileService: ProfilesService,
  ) {}

  async createRestaurant(restaurantDto: RestaurantDto): Promise<any> {
    let uniqueCode = Math.floor(Math.random() * 5596 + 1249);
    const codeCheck = await this.restaurantModel.findOne({
      uniqueCode: uniqueCode,
    });
    console.log(uniqueCode);
    if (codeCheck) uniqueCode = Math.floor(Math.random() * 5596 + 1249);
    const user = await this.profileService.createUser(restaurantDto);
    restaurantDto.userId = user._id;
    restaurantDto.uniqueCode = uniqueCode;
    const restaurant = await this.restaurantModel.create(restaurantDto);
    console.log('restaurant object = ', restaurant);
    return restaurant;
  }

  async getAllRestaurants(paginationDto: PaginationDto): Promise<any> {
    const fieldName = 'reviewObject';
    const lookupAndProjectStage =
      this.generateLookupAndProjectStageForRestaurantFilter(fieldName);
    const { limit, offset } = paginationDto;
    return this.restaurantModel
      .aggregate([...lookupAndProjectStage])
      .skip(offset)
      .limit(limit);
  }
  async getSingleRestaurantDetails(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    const pipeline = [
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
        $lookup: {
          from: 'profiles',
          localField: 'review.reviewObject.userId',
          foreignField: '_id',
          as: 'users',
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
          users: '$users',
        },
      },
      {
        $unset: [
          'users.password',
          'users.confirmationCode',
          'users.status',
          'users.role',
          'users.accountType',
          'users.socialLinks',
          'users.postAudiencePreference',
          'users.dietRequirements',
          'users.favoriteRestaurants',
          'users.favoriteCuisines',
          'users.favoriteChefs',
          'users.rewardPoints',
          'users.isPremium',
          'users.isSkip',
          'users.scopes',
          'users.bio',
          'users.estimatedSavings',
        ],
      },
      {
        $unwind: {
          path: '$vouchers',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          restaurantName: 1,
          profileImage: 1,
          reviews: 1,
          vouchers: {
            $cond: {
              if: {
                $in: [
                  new Date(
                    `${moment(new Date()).format(
                      'YYYY-MM-DD',
                    )}T00:00:00.000+00:00`,
                  ),
                  '$vouchers.voucherDisableDates',
                ],
              },
              then: null,
              else: '$vouchers',
            },
          },
          media: 1,
          redeemedVouchers: 1,
          users: 1,
        },
      },
      {
        $match: {
          vouchers: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          restaurantName: {
            $first: '$restaurantName',
          },
          profileImage: {
            $first: '$profileImage',
          },
          reviews: {
            $first: '$reviews',
          },
          media: {
            $first: '$media',
          },
          redeemedVouchers: {
            $first: '$redeemedVouchers',
          },
          users: {
            $first: '$users',
          },
          vouchers: {
            $push: '$vouchers',
          },
        },
      },
    ];
    return this.restaurantModel.aggregate(pipeline);
  }

  async getRestaurantProfile(restaurantId): Promise<any> {
    const oid = new mongoose.Types.ObjectId(restaurantId);
    return this.restaurantModel.findById(oid);
  }
  async editRestaurant(restaurantId, data): Promise<RestaurantDocument> {
    return this.restaurantModel.findByIdAndUpdate(
      { _id: restaurantId },
      {
        $set: {
          restaurantName: data.restaurantName,
          phoneNumber: data.phoneNumber,
          menu: data.menu,
          profileImage: data.profileImage,
          media: data.media,
          description: data.description,
          location: data.location,
          tags: data.tags,
          dietaryRestrictions: data.dietaryRestrictions,
          culinaryOptions: data.culinaryOptions,
          status: data.status,
          isSponsored: data.isSponsored,
          locationName: data.locationName,
        },
      },
      { returnDocument: 'after' },
    );
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
    console.log('longitude = ', data.longitude);
    console.log('latitude = ', data.latitude);
    console.log('popular = ', data.popular);
    const fieldName = 'reviewObject';
    const lookupAndProjectStage =
      this.generateLookupAndProjectStageForRestaurantFilter(fieldName);
    const { limit, offset } = paginationQuery;
    const METERS_PER_MILE = 1609.34;
    const query = [];
    let maxDistance;
    let sort = Math.random() < 0.5 ? -1 : 1;
    let pipeline = [];
    // const nearest = true;

    if (data.longitude && data.latitude) {
      console.log('here in nearest');
      // maxDistance = 1609.34 * 2;
      sort = -1;
      pipeline.push({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [
              parseFloat(data.longitude),
              parseFloat(data.latitude),
            ],
          },
          distanceField: 'distanceFromMe',
          // maxDistance: 100 * METERS_PER_MILE, //!*** distance in meters ***!//
          distanceMultiplier: 0.001,
          spherical: true,
        },
      });
    }

    if (data.popular) {
      pipeline.push({
        $match: {
          isSponsored: true,
        },
      });
      // const popular = {};
      // popular['$match'] = {
      //   isSponsored: true,
      // };
      // console.log('popular = ', popular);
      // // return;
      // query.push(popular);
    }

    if (data.cuisine) {
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
    console.log('query = ', query);
    if (
      !data.cuisine &&
      !data.popular &&
      !data.tags &&
      !data.nearest &&
      !data.longitude &&
      !data.latitude &&
      !data.dietaryRestrictions
    ) {
      console.log('no filter selected');
      return this.getAllRestaurants(paginationQuery);
    } else {
      if (query.length > 0) {
        if (pipeline.length > 0) {
          const match = { $and: query };
          pipeline.push({ $match: match });
          console.log(pipeline);
        } else {
          pipeline = [
            {
              $match: {
                $and: query,
              },
            },
          ];
        }
      }
      pipeline = [
        ...pipeline,
        ...lookupAndProjectStage,
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
        $match: {
          isSponsored: true,
        },
      },
    ]);
  }
  async depositMoney(restaurantId, amount): Promise<any> {
    const res = await this.restaurantModel.findById({ _id: restaurantId });
    if (!res)
      throw new HttpException(
        'No Such Restaurant Found',
        HttpStatus.BAD_REQUEST,
      );
    const totalDeposit = res.totalDeposit + amount;
    const availableDeposit = res.availableDeposit + amount;
    await res.update({
      $set: {
        totalDeposit: totalDeposit,
        availableDeposit: availableDeposit,
      },
    });
    return res;
  }

  async addTotalSalesAndDeductions(
    estimatedCost: number,
    restaurantId,
  ): Promise<any> {
    const res = await this.restaurantModel.findById({ _id: restaurantId });
    if (!res)
      throw new HttpException(
        'No Such Restaurant Found',
        HttpStatus.BAD_REQUEST,
      );
    const totalSales = res.totalSales + estimatedCost;
    const percent = 0.1 * estimatedCost;
    const totalDeductions = res.totalDeductions + percent;
    const availableDeposit = res.availableDeposit - percent;
    return res.update({
      $set: {
        totalSales: totalSales,
        totalDeductions: totalDeductions,
        availableDeposit: availableDeposit,
      },
    });
  }

  generateLookupAndProjectStageForRestaurantFilter(fieldName) {
    return [
      {
        $match: {
          status: 'ACTIVE',
        },
      },
      {
        $lookup: {
          from: 'restaurantreviews',
          localField: '_id',
          foreignField: 'restaurantId',
          as: 'restaurantReviews',
        },
      },
      {
        $project: {
          _id: '$_id',
          restaurantName: '$restaurantName',
          profileImage: '$profileImage',
          description: '$description',
          phoneNumber: '$phoneNumber',
          media: '$media',
          isSponsored: '$isSponsored',
          location: '$location',
          distanceFromMe: '$distanceFromMe',
          totalVoucherCount: '$totalVoucherCount',
          reviewCount: '$reviewCount',
          createdAt: '$createdAt',
          updatedAt: '$updatedAt',
          [`${fieldName}`]: '$restaurantReviews.reviewObject.rating',
        },
      },
    ];
  }

  async adminStats(): Promise<any> {
    return this.restaurantModel.aggregate([
      {
        $group: {
          _id: 0,
          totalDeposit: { $sum: '$totalDeposit' },
          totalSales: { $sum: '$totalSales' },
          totalDeductions: { $sum: '$totalDeductions' },
          availableDeposit: { $sum: '$availableDeposit' },
        },
      },
    ]);
  }

  async filterByRestaurantName(restaurantName: string): Promise<any> {
    const regex = new RegExp(restaurantName, 'i');
    return this.restaurantModel
      .find({ restaurantName: regex })
      .select('_id restaurantName description profileImage');
  }
}

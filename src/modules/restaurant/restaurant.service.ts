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
import { Tag, TagDocument } from '../../data/schemas/tags.schema';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profileService: ProfilesService,
  ) {}

  async createRestaurant(restaurantDto: any): Promise<any> {
    const tags = await this.tagModel.find();
    const tagsArray = [];
    for (let i = 0; i < tags.length; i++) {
      tagsArray.push(tags[i].tag);
    }
    for (let i = 0; i < restaurantDto.tags.length; i++) {
      if (!tagsArray.includes(restaurantDto.tags[i])) {
        await this.tagModel.create({ tag: restaurantDto.tags[i] });
      }
    }
    let uniqueCode = Math.floor(Math.random() * 5596 + 1249);
    const codeCheck = await this.restaurantModel.findOne({
      uniqueCode: uniqueCode,
    });
    if (codeCheck) uniqueCode = Math.floor(Math.random() * 8496 + 1949);
    const user = await this.profileService.createUser(restaurantDto);
    restaurantDto.userId = user._id;
    restaurantDto.uniqueCode = uniqueCode;
    return await this.restaurantModel.create(restaurantDto);
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

  /*** check if these methods are being used at the end of the project if not then remove the review count system completely ***/
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

  /*** til  here ***/
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
    const fieldName = 'reviewObject';
    const lookupAndProjectStage =
      this.generateLookupAndProjectStageForRestaurantFilter(fieldName);
    const { limit, offset } = paginationQuery;
    const query = [];
    let sort = Math.random() < 0.5 ? -1 : 1;
    let pipeline = [];

    if (data.longitude && data.latitude) {
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

          /*** distance in kilometer ***/
          // distanceMultiplier: 0.001,

          /*** distance in miles ***/
          distanceMultiplier: 0.000621371,

          /*** maxdistance would set the range of 5 miles, 1609.34 = 1 mile ***/
          maxDistance: 1609.34 * 5,
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
    if (
      !data.cuisine &&
      !data.popular &&
      !data.tags &&
      !data.nearest &&
      !data.longitude &&
      !data.latitude &&
      !data.dietaryRestrictions
    ) {
      return this.getAllRestaurants(paginationQuery);
    } else {
      if (query.length > 0) {
        if (pipeline.length > 0) {
          const match = { $and: query };
          pipeline.push({ $match: match });
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

  generateLookupAndProjectStageForRestaurantFilter(fieldName) {
    return [
      {
        $match: {
          status: 'ACTIVE',
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
        $unwind: {
          path: '$voucher',
          preserveNullAndEmptyArrays: true,
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
          _id: 1,
          restaurantName: '$restaurantName',
          profileImage: 1,
          description: 1,
          phoneNumber: 1,
          media: 1,
          studentVoucherCount: { $ifNull: ['$voucher.studentVoucherCount', 0] },
          nonStudentVoucherCount: {
            $ifNull: ['$voucher.nonStudentVoucherCount', 0],
          },
          menu: 1,
          isSponsored: 1,
          location: 1,
          distanceFromMe: 1,
          // reviewCount: 1,
          createdAt: 1,
          updatedAt: 1,
          reviewObject: 1,
          [`${fieldName}`]: '$restaurantReviews.reviewObject.rating',
        },
      },
      // {
      //   $project: {
      //     _id: '$_id',
      //     restaurantName: '$restaurantName',
      //     profileImage: '$profileImage',
      //     description: '$description',
      //     phoneNumber: '$phoneNumber',
      //     media: '$media',
      //     voucher: '$voucher',
      //     studentVoucherCount: {
      //       $sum: {
      //         $cond: [
      //           { $eq: ['$voucher.voucherObject.voucherPreference', 'BOTH'] },
      //           1,
      //           0,
      //         ],
      //       },
      //     },
      //     menu: '$menu',
      //     isSponsored: '$isSponsored',
      //     location: '$location',
      //     distanceFromMe: '$distanceFromMe',
      //     totalVoucherCount: '$totalVoucherCount',
      //     reviewCount: '$reviewCount',
      //     createdAt: '$createdAt',
      //     updatedAt: '$updatedAt',
      //     [`${fieldName}`]: '$restaurantReviews.reviewObject.rating',
      //   },
      // },
    ];
  }

  async filterByRestaurantName(restaurantName: string): Promise<any> {
    const regex = new RegExp(restaurantName, 'i');
    return this.restaurantModel
      .find({ restaurantName: regex })
      .select('_id restaurantName description profileImage');
  }

  /*** accounts module routes below ***/

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

  async getAvailableRestaurantBalance(restaurantId): Promise<any> {
    return this.restaurantModel
      .findById(restaurantId)
      .select('availableDeposit');
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from '../Schemas/restaurant.schema';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../Schemas/Profile.schema';
import {
  RedeemVoucher,
  RedeemVoucherDocument,
} from '../Schemas/redeemVoucher.schema';

@Injectable()
export class FilterService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,

    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,

    @InjectModel(RedeemVoucher.name)
    private readonly voucherRedeemModel: Model<RedeemVoucherDocument>,
  ) {}

  async nearByCuisineFilter(
    cuisines,
    tags,
    nearest,
    longitude,
    latitude,
  ): Promise<any> {
    if (!cuisines && !tags)
      throw new HttpException(
        'You must select tags or cuisine in order to apply search filter',
        HttpStatus.BAD_REQUEST,
      );
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

  // async nearByCuisineWithTags(cuisines, tags, longitude, latitude) {
  //   //  const res = await this.nearByCuisineFilter(cuisines, longitude, latitude);
  //   //   return res.aggregate([
  //   //     { $unwind: '$tags' },
  //   //     {
  //   //       $match: {
  //   //         culinaryOptions: {
  //   //           $in: tags,
  //   //         },
  //   //       },
  //   //     },
  //   //   ]);
  //   // console.log(tags);
  // }

  async filterRestaurantBasedOnCaption(keyword: string): Promise<any> {
    return this.restaurantModel.find({ $text: { $search: keyword } });
  }
  async filterNearByRestaurant(longitude, latitude): Promise<any> {
    const METERS_PER_MILE = 1609.34;
    return this.restaurantModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distanceFromMe',
          maxDistance: 20 * METERS_PER_MILE, //*** distance in meters ***//
          distanceMultiplier: 1 / 1609.34,
          spherical: true,
        },
      },
      { $sort: { location: -1 } },
    ]);
  }

  async filterPopularRestaurant(): Promise<any> {
    return this.voucherRedeemModel.aggregate([
      {
        $lookup: {
          from: 'restaurants',
          let: { restaurantId: '$restaurantId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', { $toObjectId: '$$restaurantId' }] },
              },
            },
          ],
          as: 'restaurants',
        },
      },
      { $unset: ['restaurants.uniqueCode', 'restaurants.verificationCode'] },
      { $group: { _id: '$restaurants', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
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
    // return res;
  }
}

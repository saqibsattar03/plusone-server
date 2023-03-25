import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RestaurantReview,
  RestaurantReviewDocument,
} from '../../data/schemas/restaurantReview.schema';
import mongoose, { Model } from 'mongoose';
import { RestaurantReviewDto } from '../../data/dtos/restaurant.dto';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class RestaurantReviewService {
  constructor(
    @InjectModel(RestaurantReview.name)
    private readonly restaurantReviewModel: Model<RestaurantReviewDocument>,
    private readonly restaurantService: RestaurantService,
  ) {}

  async createReview(restaurantReviewDto: RestaurantReviewDto): Promise<any> {
    restaurantReviewDto.reviewObject._id = new mongoose.Types.ObjectId(
      restaurantReviewDto.reviewObject._id,
    );
    const res = await this.restaurantReviewModel.findOne({
      restaurantId: restaurantReviewDto.restaurantId,
    });
    if (!res) {
      const r = await this.restaurantReviewModel.create({
        restaurantId: restaurantReviewDto.restaurantId,
      });
      await r.updateOne({
        $push: {
          reviewObject: {
            _id: restaurantReviewDto.reviewObject._id,
            userId: restaurantReviewDto.reviewObject.userId,
            reviewText: restaurantReviewDto.reviewObject.reviewText,
            rating: restaurantReviewDto.reviewObject.rating,
          },
        },
      });
      const res = await this.restaurantService.getRestaurantReviewCount(
        restaurantReviewDto.restaurantId,
      );
      await this.restaurantService.updateReviewCount(
        restaurantReviewDto.restaurantId,
        res.reviewCount + 1,
      );
      return res;
    } else if (res) {
      await res.updateOne({
        $push: {
          reviewObject: {
            _id: restaurantReviewDto.reviewObject._id,
            userId: restaurantReviewDto.reviewObject.userId,
            reviewText: restaurantReviewDto.reviewObject.reviewText,
            rating: restaurantReviewDto.reviewObject.rating,
          },
        },
      });
      const r = await this.restaurantService.getRestaurantReviewCount(
        restaurantReviewDto.restaurantId,
      );
      await this.restaurantService.updateReviewCount(
        restaurantReviewDto.restaurantId,
        r.reviewCount + 1,
      );
      return res;
    } else
      throw new HttpException(
        'no such restaurantssss found',
        HttpStatus.BAD_REQUEST,
      );
  }
  async editReview(data, restaurantId): Promise<any> {
    const res = await this.restaurantReviewModel.findOne({
      restaurantId: restaurantId,
    });
    if (!res)
      throw new HttpException(
        'no such restaurantssss found',
        HttpStatus.BAD_REQUEST,
      );
    else if (res) {
      const oid = mongoose.Types.ObjectId.createFromHexString(data._id);
      await this.restaurantReviewModel.findOneAndUpdate(
        {
          restaurantId: restaurantId,
          'reviewObject._id': oid,
        },
        {
          $set: {
            'reviewObject.$[element].reviewText': data.reviewText,
            'reviewObject.$[element].rating': data.rating,
          },
        },
        {
          arrayFilters: [
            {
              'element._id': oid,
            },
          ],
        },
      );
      throw new HttpException('review added successfully', HttpStatus.OK);
    } else
      throw new HttpException('no such review found', HttpStatus.BAD_REQUEST);
  }
  async deleteSingleReview(reviewId, restaurantId): Promise<any> {
    const res = await this.restaurantReviewModel.findOne({
      restaurantId: restaurantId,
    });
    if (!res)
      throw new HttpException(
        'no such restaurantssss found',
        HttpStatus.BAD_REQUEST,
      );
    else if (res) {
      const oid = mongoose.Types.ObjectId.createFromHexString(reviewId);
      await this.restaurantReviewModel.updateOne(
        { restaurantId: restaurantId },
        { $pull: { reviewObject: { _id: oid } } },
        { safe: true },
      );

      throw new HttpException('review deleted successfully', HttpStatus.OK);
    } else
      throw new HttpException('no such comment found', HttpStatus.BAD_REQUEST);
  }
  async deleteAllReviews(restaurantId): Promise<any> {
    await this.restaurantReviewModel.findOneAndDelete({
      restaurantId: restaurantId,
    });
  }
  async getRestaurantReviews(restaurantId): Promise<any> {
    return this.restaurantReviewModel.findOne({ restaurantId: restaurantId });
  }
  async deleteAllReviewsOfUser(userId): Promise<any> {
    await this.restaurantReviewModel.updateMany(
      { active: true },
      { $pull: { reviewObject: { userId: userId } } },
    );
  }
}
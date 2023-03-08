import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RestaurantReview,
  RestaurantReviewDocument,
} from '../../Schemas/restaurantReview.schema';
import mongoose, { Model } from 'mongoose';
import { CreateRestaurantReviewDto } from './dto/CreateRestaurantReviewDto.dto';

@Injectable()
export class RestaurantReviewService {
  constructor(
    @InjectModel(RestaurantReview.name)
    private readonly restaurantReviewModel: Model<RestaurantReviewDocument>,
  ) {}

  async createReview(
    restaurantReviewDto: CreateRestaurantReviewDto,
  ): Promise<any> {
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
      return res;
    } else return 'no such restaurant found';
  }

  async editReview(data, restaurantId): Promise<any> {
    const res = await this.restaurantReviewModel.findOne({
      restaurantId: restaurantId,
    });
    if (!res) return 'no such restaurant found';
    else if (res) {
      const oid = mongoose.Types.ObjectId.createFromHexString(data._id);
      const r = await this.restaurantReviewModel.findOneAndUpdate(
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
      return r;
    } else return 'no such review found';
  }

  async deleteReview(reviewId, restaurantId): Promise<any> {
    const res = await this.restaurantReviewModel.findOne({
      restaurantId: restaurantId,
    });
    if (!res) return 'no such restaurant found';
    else if (res) {
      const oid = mongoose.Types.ObjectId.createFromHexString(reviewId);

      const r = await this.restaurantReviewModel.updateOne(
        { restaurantId: restaurantId },
        { $pull: { reviewObject: { _id: oid } } },
        { safe: true },
      );

      return r;
    } else return 'no such comment found';
  }
}

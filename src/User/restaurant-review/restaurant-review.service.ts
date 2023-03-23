import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RestaurantReview,
  RestaurantReviewDocument,
} from '../../Schemas/restaurantReview.schema';
import mongoose, { Model } from 'mongoose';
import { CreateRestaurantReviewDto } from './dto/CreateRestaurantReviewDto.dto';
import {
  Restaurant,
  RestaurantDocument,
} from '../../Schemas/restaurant.schema';

@Injectable()
export class RestaurantReviewService {
  private reviewCount = 0;
  constructor(
    @InjectModel(RestaurantReview.name)
    private readonly restaurantReviewModel: Model<RestaurantReviewDocument>,

    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
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
      this.reviewCount++;
      console.log(this.reviewCount);
      await this.restaurantModel.updateOne({
        $set: { reviewCount: this.reviewCount },
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
      this.reviewCount++;
      await this.restaurantModel.updateOne({
        $set: { reviewCount: this.reviewCount },
      });
      return res;
    } else
      throw new HttpException(
        'no such restaurant found',
        HttpStatus.BAD_REQUEST,
      );
  }

  async editReview(data, restaurantId): Promise<any> {
    const res = await this.restaurantReviewModel.findOne({
      restaurantId: restaurantId,
    });
    if (!res)
      throw new HttpException(
        'no such restaurant found',
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

  async deleteReview(reviewId, restaurantId): Promise<any> {
    const res = await this.restaurantReviewModel.findOne({
      restaurantId: restaurantId,
    });
    if (!res)
      throw new HttpException(
        'no such restaurant found',
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
}

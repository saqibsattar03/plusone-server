import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from '../Schemas/restaurant.schema';
import { Model } from 'mongoose';

@Injectable()
export class FilterService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async filterCuisines(cuisine): Promise<any> {
    console.log('cuisines = ', cuisine);
    const cuisines = await this.restaurantModel.aggregate([
      { $unwind: '$tags' },
      {
        $match: {
          tags: {
            $in: cuisine,
          },
        },
      },
    ]);
    return cuisines;
  }

  async filterRestaurantBasedOnCaption(keyword: string): Promise<any> {
    console.log(keyword);
    return this.restaurantModel.find({ $text: { $search: keyword } });
  }
}

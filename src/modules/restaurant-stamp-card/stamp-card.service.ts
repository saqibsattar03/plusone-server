import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  StampCard,
  StampCardDocument,
} from '../../data/schemas/stamp-card.schema';
import mongoose, { Model } from 'mongoose';
import { RestaurantStampCardDto } from '../../data/dtos/restaurantStampCard.dto';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';

@Injectable()
export class StampCardService {
  constructor(
    @InjectModel(StampCard.name)
    private readonly stampCardModel: Model<StampCardDocument>,
  ) {}
  async createStampCard(
    stampCardDto: RestaurantStampCardDto,
  ): Promise<StampCard> {
    return this.stampCardModel.create(stampCardDto);
  }
  async getSingleStampCard(cardId): Promise<StampCard> {
    return this.stampCardModel.findById(cardId);
  }

  // async getSingleRestaurantStampCard(
  //   restaurantId: string,
  // ): Promise<StampCardDocument[]> {
  //   return this.stampCardModel
  //     .find({
  //       restaurantId: new mongoose.Types.ObjectId(restaurantId),
  //     })
  //     .sort({ createdAt: -1 });
  // }
  async getAllStampCards(restaurantId: string): Promise<StampCardDocument[]> {
    console.log(restaurantId);
    return this.stampCardModel
      .find({ restaurantId: new mongoose.Types.ObjectId(restaurantId) })
      .sort({ createdAt: -1 });
  }
  async editStampCard(
    cardId,
    stampCardDto: RestaurantStampCardDto,
  ): Promise<any> {
    return this.stampCardModel.findOneAndUpdate(
      { _id: cardId },
      {
        title: stampCardDto.title,
        totalPoints: stampCardDto.totalPoints,
        timeDurationInDays: stampCardDto.timeDurationInDays,
        reward: stampCardDto.reward,
      },
      { new: true },
    );
  }
  async deleteStampCard(id): Promise<any> {
    return this.stampCardModel.findByIdAndDelete({ _id: id });
  }
}

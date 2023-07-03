import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserStampCard,
  UserStampCardDocument,
} from '../../data/schemas/user-stamp-card.schema';
import mongoose, { Model } from 'mongoose';
import { UserStampCardDto } from '../../data/dtos/userStampCard.dto';
import {
  StampCardHistory,
  StampCardHistoryDocument,
} from '../../data/schemas/stamp-card-history.schema';

@Injectable()
export class UserStampCardService {
  constructor(
    @InjectModel(UserStampCard.name)
    private readonly userStampCardModel: Model<UserStampCardDocument>,
    @InjectModel(StampCardHistory.name)
    private readonly stampCardHistoryModel: Model<StampCardHistoryDocument>,
  ) {}

  async createStampCard(
    userStampCardDto: UserStampCardDto,
  ): Promise<UserStampCardDocument> {
    const res = await this.userStampCardModel.findOne({
      userId: userStampCardDto.userId,
      cardId: userStampCardDto.cardId,
    });
    if (!res) {
      await this.stampCardHistoryModel.create({
        cardId: new mongoose.Types.ObjectId(userStampCardDto.cardId),
        userId: new mongoose.Types.ObjectId(userStampCardDto.userId),
        restaurantId: new mongoose.Types.ObjectId(
          userStampCardDto.restaurantId,
        ),
      });
      return this.userStampCardModel.create({
        cardId: new mongoose.Types.ObjectId(userStampCardDto.cardId),
        userId: new mongoose.Types.ObjectId(userStampCardDto.userId),
        restaurantId: new mongoose.Types.ObjectId(
          userStampCardDto.restaurantId,
        ),
        redeemedPoints: userStampCardDto.redeemedPoints,
        startDate: userStampCardDto.startDate,
      });
    } else {
      await this.stampCardHistoryModel.create({
        cardId: new mongoose.Types.ObjectId(userStampCardDto.cardId),
        userId: new mongoose.Types.ObjectId(userStampCardDto.userId),
        restaurantId: new mongoose.Types.ObjectId(
          userStampCardDto.restaurantId,
        ),
      });
      return this.userStampCardModel.findOneAndUpdate(
        {
          cardId: userStampCardDto.cardId,
          userId: userStampCardDto.userId,
        },
        {
          redeemedPoints: userStampCardDto.redeemedPoints,
          startDate: userStampCardDto.startDate,
        },
        { new: true },
      );
    }
  }
}

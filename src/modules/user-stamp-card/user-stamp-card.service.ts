import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { PaginationDto } from '../../common/auth/dto/pagination.dto';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class UserStampCardService {
  constructor(
    @InjectModel(UserStampCard.name)
    private readonly userStampCardModel: Model<UserStampCardDocument>,
    @InjectModel(StampCardHistory.name)
    private readonly stampCardHistoryModel: Model<StampCardHistoryDocument>,
    private readonly restaurantService: RestaurantService,
  ) {}

  async createStampCard(
    userStampCardDto: UserStampCardDto,
  ): Promise<UserStampCardDocument> {
    const { userId, cardId, restaurantId } = userStampCardDto;
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const cardIdObj = new mongoose.Types.ObjectId(cardId);
    const restaurantIdObj = new mongoose.Types.ObjectId(restaurantId);
    const res = await this.userStampCardModel.findOne({
      userId: userIdObj,
      cardId: cardIdObj,
    });

    //*** stamp card history ***//

    await this.stampCardHistoryModel.create({
      cardId: cardIdObj,
      userId: userIdObj,
      restaurantId: restaurantIdObj,
    });
    if (!res) {
      //*** create user new stamp card ***//
      return this.userStampCardModel.create({
        cardId: cardIdObj,
        userId: userIdObj,
        restaurantId: restaurantIdObj,
        redeemedPoints: 1,
        startDate: Date.now(),
      });
    } else {
      //*** resetting the start date  ***//
      // if (res.redeemedPoints === 0) {
      return this.userStampCardModel.findOneAndUpdate(
        {
          cardId: cardIdObj,
          userId: userIdObj,
        },
        {
          $inc: { redeemedPoints: 1 },
          startDate: res.redeemedPoints == 0 ? Date.now() : res.startDate,
        },
        { new: true },
      );
      // } else
      //   return this.userStampCardModel.findOneAndUpdate(
      //     {
      //       cardId: cardIdObj,
      //       userId: userIdObj,
      //     },
      //     {
      //       $inc: { redeemedPoints: 1 },
      //     },
      //     { new: true },
      //   );
    }
  }

  async getUserStampCards(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<UserStampCardDocument[]> {
    const { limit, offset } = paginationDto;
    return this.userStampCardModel
      .find({
        userId: new mongoose.Types.ObjectId(userId),
      })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getUserSingleStampCard(userId, cardId): Promise<any> {
    const res = await this.userStampCardModel.findOne({
      // userId: userId,
      cardId: new mongoose.Types.ObjectId(cardId),
    });
    return res;
  }

  async userStampCardStatus(
    userId: string,
    cardId: string,
    status: string,
  ): Promise<UserStampCardDocument> {
    return this.userStampCardModel.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        cardId: new mongoose.Types.ObjectId(cardId),
      },
      { status: status },
      { new: true },
    );
  }

  async redeemStampCard(userId: string, data): Promise<UserStampCardDocument> {
    const stampCardUniqueCode =
      await this.restaurantService.getRestaurantVerificationCode(
        data.restaurantId,
      );
    if (data.uniqueCode === stampCardUniqueCode.stampCardUniqueCode) {
      return this.userStampCardModel.findOneAndUpdate(
        {
          useId: new mongoose.Types.ObjectId(userId),
          cardId: new mongoose.Types.ObjectId(data.cardId),
        },
        { $inc: { redeemedPoints: 1 } },
        { new: true },
      );
    } else
      throw new HttpException('Code does not match', HttpStatus.BAD_REQUEST);
  }

  async resetStampCard(
    userId: string,
    cardId: string,
  ): Promise<UserStampCardDocument> {
    return this.userStampCardModel.findOneAndUpdate(
      {
        useId: new mongoose.Types.ObjectId(userId),
        cardId: new mongoose.Types.ObjectId(cardId),
      },
      { redeemedPoints: 0, startDate: null },
      { new: true },
    );
  }
}

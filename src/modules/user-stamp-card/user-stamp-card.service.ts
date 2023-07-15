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
import { StampCardService } from '../restaurant-stamp-card/stamp-card.service';

@Injectable()
export class UserStampCardService {
  constructor(
    @InjectModel(UserStampCard.name)
    private readonly userStampCardModel: Model<UserStampCardDocument>,
    @InjectModel(StampCardHistory.name)
    private readonly stampCardHistoryModel: Model<StampCardHistoryDocument>,
    private readonly restaurantService: RestaurantService,
    private readonly stampCardService: StampCardService,
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
    const totalPoints = await this.stampCardService.getSingleStampCard(cardId);
    await this.createStampCardHistory(
      cardId,
      userId,
      totalPoints.totalPoints,
      restaurantId,
    );
    if (!res) {
      //*** create user new stamp card ***//
      return this.userStampCardModel.create({
        cardId: cardIdObj,
        userId: userIdObj,
        restaurantId: restaurantIdObj,
        redeemedPoints: userStampCardDto.redeemedPoints,
        // redeemedPoints: 0,
        // startDate: Date.now(),
        startDate: userStampCardDto.startDate
          ? userStampCardDto.startDate
          : null,
      });
    } else {
      //*** resetting the start date  ***//
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

  async getUserSingleStampCard(data: UserStampCardDto): Promise<any> {
    const res = await this.userStampCardModel.findOne({
      userId: new mongoose.Types.ObjectId(data.userId),
      cardId: new mongoose.Types.ObjectId(data.cardId),
    });
    data.redeemedPoints = 0;
    return res ? res : this.createStampCard(data);
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
  async redeemStampCard(data): Promise<UserStampCardDocument> {
    const { restaurantId, cardId, userId, uniqueCode } = data;
    const [stampCardUniqueCode, restaurantStampCard, userRedeemedPoints] =
      await Promise.all([
        this.restaurantService.getRestaurantVerificationCode(restaurantId),
        this.stampCardService.getSingleStampCard(cardId),
        this.userStampCardModel
          .findOne({
            cardId: new mongoose.Types.ObjectId(cardId),
            userId: new mongoose.Types.ObjectId(userId),
          })
          .select('redeemedPoints -_id'),
      ]);

    const totalPoints = await this.stampCardService.getSingleStampCard(cardId);
    if (uniqueCode === stampCardUniqueCode.stampCardUniqueCode) {
      const redeemedPoints = userRedeemedPoints.redeemedPoints;
      if (redeemedPoints === restaurantStampCard.totalPoints - 1) {
        await this.createStampCardHistory(
          cardId,
          userId,
          totalPoints.totalPoints,
          restaurantId,
        );
        await this.getReward(redeemedPoints, restaurantStampCard, data);
      } else {
        const updateQuery = {
          userId: new mongoose.Types.ObjectId(userId),
          cardId: new mongoose.Types.ObjectId(cardId),
        };

        const updateOptions = { $inc: { redeemedPoints: 1 } };
        if (redeemedPoints === 0) {
          Object.assign(updateOptions, { startDate: Date.now() });
        }
        await this.createStampCardHistory(
          cardId,
          userId,
          totalPoints.totalPoints,
          restaurantId,
        );
        return this.userStampCardModel.findOneAndUpdate(
          updateQuery,
          updateOptions,
          { new: true },
        );
      }
    } else {
      throw new HttpException('Code does not match', HttpStatus.BAD_REQUEST);
    }
  }

  async getReward(redeemedPoints, restaurantStampCard, data) {
    await this.userStampCardModel.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(data.userId),
        cardId: new mongoose.Types.ObjectId(data.cardId),
      },
      { redeemedPoints: 0, startDate: null },
      { new: true },
    );
    throw new HttpException(
      `Free ${restaurantStampCard.reward}`,
      HttpStatus.OK,
    );
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

  async getStampCardHistory(userId, cardId): Promise<UserStampCardDocument[]> {
    console.log('userId :: ', userId);
    return this.stampCardHistoryModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      cardId: new mongoose.Types.ObjectId(cardId),
    });
  }

  async createStampCardHistory(cardId, userId, totalPoints, restaurantId) {
    //*** stamp card history ***//

    await this.stampCardHistoryModel.create({
      cardId: new mongoose.Types.ObjectId(cardId),
      userId: new mongoose.Types.ObjectId(userId),
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      totalPoints: totalPoints,
    });
  }

  async getAwardedGifts(userId): Promise<any> {
    const gifts = new Set();
    const userCards = await this.userStampCardModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    });
    const restaurantCards = await this.stampCardHistoryModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    const restaurantCardsMap = {};
    for (const card of restaurantCards) {
      restaurantCardsMap[card.cardId.toString()] = card;
    }

    for (const userCard of userCards) {
      const restaurantCard = restaurantCardsMap[userCard.cardId.toString()];
      if (
        restaurantCard &&
        userCard.redeemedPoints === restaurantCard.totalPoints
      ) {
        gifts.add(restaurantCard);
      }
    }

    return Array.from(gifts);
    // for (let i = 0; i < userCards.length; i++) {
    //   for (let j = 0; j < restaurantCards.length; j++) {
    //     if (
    //       userCards[i].cardId.toString() ===
    //       restaurantCards[j].cardId.toString()
    //     ) {
    //       if (userCards[i].redeemedPoints === restaurantCards[j].totalPoints) {
    //         gifts.push(restaurantCards[j]);
    //       }
    //     }
    //   }
    // }
    // return gifts;
  }
}

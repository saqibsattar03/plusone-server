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
import { PaginationDto } from '../../common/auth/dto/pagination.dto';

@Injectable()
export class UserStampCardService {
  constructor(
    @InjectModel(UserStampCard.name)
    private readonly userStampCardModel: Model<UserStampCardDocument>,
    @InjectModel(StampCardHistory.name)
    private readonly stampCardHistoryModel: Model<StampCardHistoryDocument>,
  ) {}

  // async createStampCard(
  //   userStampCardDto: UserStampCardDto,
  // ): Promise<UserStampCardDocument> {
  //   const res = await this.userStampCardModel.findOne({
  //     userId: new mongoose.Types.ObjectId(userStampCardDto.userId),
  //     cardId: new mongoose.Types.ObjectId(userStampCardDto.cardId),
  //   });
  //
  //   console.log('user stamp card :: ', res);
  //
  //   if (!res) {
  //     //*** create user new stamp card ***//
  //
  //     await this.stampCardHistoryModel.create({
  //       cardId: new mongoose.Types.ObjectId(userStampCardDto.cardId),
  //       userId: new mongoose.Types.ObjectId(userStampCardDto.userId),
  //       restaurantId: new mongoose.Types.ObjectId(
  //         userStampCardDto.restaurantId,
  //       ),
  //     });
  //     return this.userStampCardModel.create({
  //       cardId: new mongoose.Types.ObjectId(userStampCardDto.cardId),
  //       userId: new mongoose.Types.ObjectId(userStampCardDto.userId),
  //       restaurantId: new mongoose.Types.ObjectId(
  //         userStampCardDto.restaurantId,
  //       ),
  //       redeemedPoints: userStampCardDto.redeemedPoints,
  //       // startDate: userStampCardDto.startDate,
  //       startDate: Date.now(),
  //     });
  //   } else {
  //     await this.stampCardHistoryModel.create({
  //       cardId: new mongoose.Types.ObjectId(userStampCardDto.cardId),
  //       userId: new mongoose.Types.ObjectId(userStampCardDto.userId),
  //       restaurantId: new mongoose.Types.ObjectId(
  //         userStampCardDto.restaurantId,
  //       ),
  //     });
  //     //*** resetting the start date  ***//
  //     if (res.redeemedPoints === 0) {
  //       return this.userStampCardModel.findOneAndUpdate(
  //         {
  //           cardId: new mongoose.Types.ObjectId(userStampCardDto.cardId),
  //           userId: new mongoose.Types.ObjectId(userStampCardDto.userId),
  //         },
  //         {
  //           redeemedPoints: res.redeemedPoints + 1,
  //           startDate: Date.now(),
  //         },
  //         { new: true },
  //       );
  //     } else
  //       return this.userStampCardModel.findOneAndUpdate(
  //         {
  //           cardId: new mongoose.Types.ObjectId(userStampCardDto.cardId),
  //           userId: new mongoose.Types.ObjectId(userStampCardDto.userId),
  //         },
  //         {
  //           redeemedPoints: res.redeemedPoints + 1,
  //           // startDate: userStampCardDto.startDate,
  //         },
  //         { new: true },
  //       );
  //   }
  // }

  async createStampCard(
    userStampCardDto: UserStampCardDto,
  ): Promise<UserStampCardDocument> {
    const { userId, cardId, restaurantId } = userStampCardDto;
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const cardIdObj = new mongoose.Types.ObjectId(cardId);
    const restaurantIdObj = new mongoose.Types.ObjectId(restaurantId);
    const startDate = Date.now();
    const res = await this.userStampCardModel.findOne({
      userId: userIdObj,
      cardId: cardIdObj,
    });

    await this.stampCardHistoryModel.create({
      cardId: cardIdObj,
      userId: userIdObj,
      restaurantId: restaurantIdObj,
    });

    const stampCard = await this.userStampCardModel.findOneAndUpdate(
      { cardId: cardIdObj, userId: userIdObj },
      {
        $inc: { redeemedPoints: 1 },
        startDate: res.redeemedPoints === 0 ? startDate : undefined,
      },
      { new: true, upsert: true },
    );

    if (!stampCard.startDate) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      stampCard.startDate = Date.now();
      await stampCard.save();
    }

    return stampCard;
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

  async redeemStampCard(
    userId: string,
    cardId: string,
  ): Promise<UserStampCardDocument> {
    return this.userStampCardModel.findOneAndUpdate(
      {
        useId: new mongoose.Types.ObjectId(userId),
        cardId: new mongoose.Types.ObjectId(cardId),
      },
      { redeemedPoints: 0 },
      { new: true },
    );
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FcmHistory, FcmDocument } from '../../data/schemas/fcmHistory.schema';
import mongoose, { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ProfilesService } from '../profiles/profiles.service';
import { messaging } from '../../main';
import { PaginationDto } from '../../common/auth/dto/pagination.dto';

@Injectable()
export class FcmService {
  constructor(
    @InjectModel(FcmHistory.name)
    private readonly fcmHistoryModel: Model<FcmDocument>,
    private readonly httpService: HttpService,
    protected readonly profileService: ProfilesService,
  ) {}
  async sendSingleNotification(
    data: any,
    receiverId: string | null = null,
  ): Promise<any> {
    console.log('receiver Id in fcm method :: ', receiverId);
    console.log('data in fcm method :: ', data);
    try {
      const user = await this.profileService.getUser(data.email.toLowerCase());
      console.log('user in fcm method :: ', user);
      if (user.fcmToken) {
        console.log('fcm token found ::');
        const message = {
          notification: {
            title: data.title,
            body: data.body,
          },
          // android: {
          //   notification: {
          //     imageUrl:
          //       'http://192.168.18.56:3000/uploads/433c63ac-6af6-4f04-8d63-2c78a0623022.png',
          //   },
          // },
          token: user.fcmToken,
          data: {
            createdAt: new Date().toISOString(),
          },
        };
        await messaging.send(message);
        return await this.fcmHistoryModel.create({
          userId: user,
          // receiverId: new mongoose.Types.ObjectId('644a4c7d1913f5e2b20fd596'),
          receiverId: new mongoose.Types.ObjectId(receiverId),
          title: data.title,
          body: data.body,
          seen: false,
          profileImage: data.profileImage,
        });
      }
    } catch (e) {
      // throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  async updateFcmToken(data): Promise<any> {
    return this.profileService.updateFcmToken(data._id, data.token);
  }

  async userHistory(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<any> {
    const { limit, offset } = paginationDto;
    return await this.fcmHistoryModel
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async userUnseenHistory(user: string): Promise<any> {
    return await this.fcmHistoryModel
      .find({ user, seen: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async unSeenToSeenHistory(userId: string): Promise<any> {
    return await this.fcmHistoryModel
      .updateMany(
        { userId: new mongoose.Types.ObjectId(userId) },
        { seen: true },
      )
      .exec();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from '../Schemas/chat.schema';
import { Model } from 'mongoose';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<ChatDocument>,
  ) {}

  async createChat(chatDto: ChatDto): Promise<ChatDocument> {
    const res = await this.chatModel.findOne({
      senderId: chatDto.senderId,
      to: chatDto.to,
    });
    if (!res) {
      const r = await this.chatModel.create({
        senderId: chatDto.senderId,
        to: chatDto.to,
      });
      await r.updateOne({
        $push: {
          conversation: {
            message: chatDto.conversation.message,
            senderId: chatDto.conversation.senderId,
          },
        },
      });
      console.log('chat created');
      return r;
    } else if (res) {
      await res.updateOne({
        $push: {
          conversation: {
            message: chatDto.conversation.message,
            senderId: chatDto.conversation.senderId,
          },
        },
      });
    }
    return;
  }
}

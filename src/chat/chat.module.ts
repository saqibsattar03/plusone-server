import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '../Schemas/chat.schema';
import { Profile, ProfileSchema } from '../Schemas/Profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

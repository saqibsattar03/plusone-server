import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/data/schemas/comment.schema';
import { SocialPostsModule } from '../social-posts.module';
import { ProfilesModule } from '../../profiles/profiles.module';
import { FcmModule } from '../../fcm/fcm.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
    forwardRef(() => SocialPostsModule),
    ProfilesModule,
    FcmModule,
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}

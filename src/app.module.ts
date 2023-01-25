import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocialPostsModule } from './social-posts/social-posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    SocialPostsModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/dummy-app', {
      useNewUrlParser: true,
    }),
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

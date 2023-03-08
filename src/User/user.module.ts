import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../Schemas/user.schema';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { Profile, ProfileSchema } from '../Schemas/Profile.schema';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

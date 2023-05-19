import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3, SES } from 'aws-sdk';
import * as process from 'process';

@Module({
  imports: [
    AwsSdkModule.forRootAsync({
      // defaultServiceOptions: {
      //   // useFactory: () => {
      //   // return new SES({
      //   //   region: 'eu-north-1',
      //   //   // region: process.env.AWS_REGION,
      //   //   credentials: {
      //   //     accessKeyId: process.env.ACCESS_KEY_ID,
      //   //     secretAccessKey: process.env.SECRET_ACCESS_KEY,
      //   //   },
      //   // });
      //   // },
      //   // useFactory: () => ({
      //   //   region: process.env.AWS_REGION,
      //   //   // region: 'eu-north-1',
      //   //   // accessKeyId: process.env.ACCESS_KEY_ID,
      //   //   // accessKeyId: 'AKIAZR4CXEL2IAPM4S7P',
      //   //   // secretAccessKey: process.env.SECRET_ACCESS_KEY,
      //   //   // secretAccessKey: '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',
      //   // }),
      // },
      services: [SES],
    }),
  ],
  controllers: [MailController],
  providers: [MailService, SES],
})
export class MailModule {}

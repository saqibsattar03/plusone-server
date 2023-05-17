import { Injectable } from '@nestjs/common';
import { AwsMailUtil } from '../../common/utils/aws-mail-util';

@Injectable()
export class MailService {
  // async sendEmail(
  //   templateContent: string,
  //   recipient: string,
  //   subject: string,
  //   templateData: Record<string, any>,
  // ) {
  //   const template = fs.readFileSync(
  //     join(process.cwd(), 'src', 'modules', 'templates', 'AccountVerification.hbs'),
  //   );
  //   const templateCompiler = handlebars.compile(String(template));
  //   const finalTemplate = templateCompiler({
  //     title: 'Test',
  //     code: 4568,
  //   });
  //   const params = {
  //     Destination: {
  //       ToAddresses: [recipient],
  //     },
  //     Source: process.env.SENDER_EMAIL,
  //     // Source: 'no-reply@plusoneworldwide.com',
  //     Message: {
  //       Body: {
  //         Html: {
  //           Charset: 'UTF-8',
  //           Data: finalTemplate,
  //         },
  //       },
  //       Subject: {
  //         Charset: 'UTF-8',
  //         Data: 'Test email',
  //       },
  //     },
  //   };
  //
  //   try {
  //     await ses.sendEmail(params).promise();
  //     // await ses.sendTemplatedEmail(params).promise();
  //     console.log('Email sent successfully.');
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // }

  async createTemplate(data: any): Promise<any> {
    await new AwsMailUtil().createTemplate(data);
  }

  async sendEmail(
    templateContent: string,
    recipient: string,
    templateData: Record<string, any>,
    name = 'AccountVerification',
  ) {
    // await new AwsMailUtil().sendEmail(
    //   templateContent,
    //   recipient,
    //   templateData,
    //   name,
    // );
  }

  async deleteTemplate(template_name: string) {
    await new AwsMailUtil().deleteTemplate(template_name);
  }
}

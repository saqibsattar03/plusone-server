import { Injectable } from '@nestjs/common';
import * as process from 'process';
import * as AWS from 'aws-sdk';
import { SES } from 'aws-sdk';
import * as fs from 'fs';
import { join } from 'path';
import { AwsMailUtil } from '../../common/utils/aws-mail-util';

// const ses = new SES({
//   region: 'eu-north-1',
//   credentials: {
//     accessKeyId: 'AKIAZR4CXEL2IAPM4S7P',
//     secretAccessKey: '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',
//   },
// });

@Injectable()
export class MailService {
  // private ses: AWS.SES;
  constructor() {
    // AWS.config.update({
    //   region: 'eu-north-1',
    //   credentials: {
    //     accessKeyId: 'AKIAZR4CXEL2IAPM4S7P',
    //     secretAccessKey: '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',
    //   },
    // });
    // this.ses = new AWS.SES({ apiVersion: '2010-12-01' });
  }
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
    // const params = {
    //   Template: {
    //     TemplateName: data.templateName,
    //     HtmlPart: String(
    //       fs.readFileSync(
    //         join(
    //           process.cwd(),
    //           'src',
    //           'modules',
    //           'templates',
    //           data.template + '.hbs',
    //         ),
    //       ),
    //     ),
    //     SubjectPart: data.subject,
    //   },
    // };
    // this.ses.createTemplate(params, (e, data) => {
    //   if (e) console.log(e);
    //   else console.log(data);
    // });
  }

  async sendEmail(
    templateContent: string,
    recipient: string,
    templateData: Record<string, any>,
    name = 'AccountVerification',
  ) {
    await new AwsMailUtil().sendEmail(
      templateContent,
      recipient,
      templateData,
      name,
    );
    // const params = {
    //   Destination: {
    //     ToAddresses: [recipient],
    //   },
    //   Source: process.env.SENDER_EMAIL,
    //   Template: name,
    //   TemplateData: JSON.stringify(templateData),
    // };
    // try {
    //   await this.ses.sendTemplatedEmail(params).promise();
    //   console.log('Email sent successfully.');
    // } catch (error) {
    //   console.error('Error sending email:', error);
    // }
  }

  async deleteTemplate(template_name: string) {
    // const params = {
    //   TemplateName: template_name,
    // };
    //
    // try {
    //   await this.ses.deleteTemplate(params).promise();
    //   console.log('Email Delete successfully.');
    // } catch (error) {
    //   console.error('Error Delete email:', error);
    // }
  }
}

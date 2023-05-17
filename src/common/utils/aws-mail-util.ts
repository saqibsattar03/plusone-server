import * as AWS from 'aws-sdk';
import fs from 'fs';
import { join } from 'path';
import * as process from 'process';
export class AwsMailUtil {
  private ses: AWS.SES;
  public constructor() {
    AWS.config.update({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: 'AKIAZR4CXEL2IAPM4S7P',
        secretAccessKey: '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',
      },
    });
    this.ses = new AWS.SES({ apiVersion: '2010-12-01' });
  }

  public createTemplate(data: any) {
    const params = {
      Template: {
        TemplateName: data.templateName,
        HtmlPart: String(
          fs.readFileSync(
            join(
              process.cwd(),
              'src',
              'modules',
              'templates',
              data.template + '.hbs',
            ),
          ),
        ),
        SubjectPart: data.subject,
      },
    };
    this.ses.createTemplate(params, (e, data) => {
      if (e) console.log(e);
      else console.log(data);
    });
  }

  public async sendEmail(
    templateContent: string,
    recipient: string,
    templateData: Record<string, any>,
    name = 'AccountVerification',
  ) {
    const params = {
      Destination: {
        ToAddresses: [recipient],
      },
      Source: process.env.SENDER_EMAIL,
      Template: name,
      TemplateData: JSON.stringify(templateData),
    };
    try {
      await this.ses.sendTemplatedEmail(params).promise();
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  public async deleteTemplate(template_name: string) {
    const params = {
      TemplateName: template_name,
    };

    try {
      await this.ses.deleteTemplate(params).promise();
      console.log('Email Delete successfully.');
    } catch (error) {
      console.error('Error Delete email:', error);
    }
  }
}

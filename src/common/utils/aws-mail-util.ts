import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { join } from 'path';
import * as process from 'process';
export class AwsMailUtil {
  private ses: AWS.SES;
  public constructor() {
    AWS.config.update({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        // accessKeyId: 'AKIAZR4CXEL2IAPM4S7P',
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        // secretAccessKey: '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',
      },
    });
    this.ses = new AWS.SES({ apiVersion: '2010-12-01' });
  }

  public async createTemplate(data: any): Promise<any> {
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
    recipient: string,
    templateData: Record<string, any>,
    templateName,
  ) {
    const params = {
      Destination: {
        ToAddresses: [recipient],
      },
      Source: process.env.SENDER_EMAIL,
      Template: templateName,
      // ContentType: 'application/pdf',
      // Attachment: 'invoice.pdf',
      TemplateData: JSON.stringify(templateData),
    };
    try {
      await this.ses.sendTemplatedEmail(params).promise();
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  public async sendEmailWithAttachment(file: any) {
    // const fileContent = fs.readFileSync(join(process.cwd(), 'invoice.pdf')); // Replace with the actual file path of the PDF );
    // const base64Data = fileContent.toString('base64');
    const params = {
      RawMessage: {
        Data: `From: rkhabeer84@gmail.com
To: saqibsattar710@gmail.com
Subject: Financial Report
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="boundary-example"

--boundary-example
Content-Type: text/plain

Your Monthly Report is Attached

--boundary-example
Content-Type: application/pdf
Content-Disposition: attachment; filename="invoice.pdf"
Content-Transfer-Encoding: base64

${file}

--boundary-example--`,
      },
    };
    try {
      console.log('Email sent successfully.');
      await this.ses.sendRawEmail(params).promise();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  public async deleteTemplate(templateName: string) {
    const params = {
      TemplateName: templateName,
    };

    try {
      await this.ses.deleteTemplate(params).promise();
      console.log('Email Template Deleted successfully.');
    } catch (error) {
      console.error('Error Deleting Template:', error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { AwsMailUtil } from '../../common/utils/aws-mail-util';

@Injectable()
export class MailService {
  async createTemplate(data: any): Promise<any> {
    await new AwsMailUtil().createTemplate(data);
  }
  async deleteTemplate(template_name: string) {
    await new AwsMailUtil().deleteTemplate(template_name);
  }
}

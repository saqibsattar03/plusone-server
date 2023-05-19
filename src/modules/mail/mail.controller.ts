import { Body, Controller, Delete, Param } from '@nestjs/common';
import { MailService } from './mail.service';
import { Get, Post } from '@nestjs/common/decorators';
import * as fs from 'fs';
import * as process from 'process';
import { join } from 'path';
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async sendEmail() {
    const templateName = 'auth_1'; // Name of your template file
    const recipient = 'saqibsattar710@gmail.com'; // Replace with the recipient's email address

    const templateData = {
      title: 'Test', // Example template data. Customize as needed
      code: 4568,
    };

    // await this.mailService.sendEmail(templateName, recipient, templateData);

    return { message: 'Email sent successfully' };
  }

  @Post('create-template')
  createTemplate(@Body() data) {
    console.log(data);
    return this.mailService.createTemplate(data);
  }
  @Delete(':name')
  deleteTemplate(@Param('name') name: string) {
    return this.mailService.deleteTemplate(name);
  }
}

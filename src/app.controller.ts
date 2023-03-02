import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';

@Controller()
export class AppController {
  @Get('/')
  get() {
    return 'hello world';
  }
}

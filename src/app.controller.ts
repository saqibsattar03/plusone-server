import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from './app.service';
import { Body, Post, Request } from "@nestjs/common/decorators";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./auth/guards/local-auth.guard";
import { AuthService } from "./auth/auth.service";

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

//   @Post('auth/login')
//   async login(@Body() data) {
//     console.log("user name1111 = " ,  data.user.email)
// return this.authService.login(data.user)
//   }
}

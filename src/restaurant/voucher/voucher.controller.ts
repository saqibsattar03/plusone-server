import {
  Body,
  Controller,
  Delete,
  Patch,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Get, Post, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidation } from '../../common/image.config';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('create-for-student')
  @UseInterceptors(FileInterceptor('media', imageValidation))
  createStudentVoucher(@Body() data, @UploadedFile() media) {
    const filename = media.originalname.trim();
    const filePath = media.path;
    const fileInfo = {
      fileName: filename,
      filePath: filePath,
    };
    if (media) {
      data.voucherObject = {
        discount: data.discount,
        description: data.description,
        voucherType: data.voucherType,
        voucherCode: data.voucherCode,
        voucherImage: fileInfo,
      };
      return this.voucherService.createStudentVoucher(data);
    } else return 'Picture must be provided to create voucher';
  }
  @Post('create-for-non-student')
  @UseInterceptors(FileInterceptor('media', imageValidation))
  createNonStudentVoucher(@Body() data, @UploadedFile() media) {
    const filename = media.originalname.trim();
    const filePath = media.path;
    const fileInfo = {
      fileName: filename,
      filePath: filePath,
    };
    if (media) {
      data.voucherObject = {
        discount: data.discount,
        description: data.description,
        voucherType: data.voucherType,
        voucherCode: data.voucherCode,
        voucherImage: fileInfo,
      };
      return this.voucherService.createNonStudentVoucher(data);
    } else return 'Picture must be provided to create voucher';
  }

  @Get('get-all-vouchers-by-restaurant')
  getAllVouchersByRestaurant(
    @Query('restaurantId') restaurantId,
    @Query('voucherType') voucherType,
  ) {
    return this.voucherService.getAllVouchersByRestaurant(
      restaurantId,
      voucherType,
    );
  }
  @Patch('edit')
  @UseInterceptors(FileInterceptor('media', imageValidation))
  editVoucher(
    @Body() data,
    @UploadedFile() media,
    @Query('voucherId') voucherId,
  ) {
    const filename = media.originalname.trim();
    const filePath = media.path;
    const fileInfo = {
      fileName: filename,
      filePath: filePath,
    };
    if (media) {
      data.voucherObject = {
        discount: data.discount,
        description: data.description,
        voucherType: data.voucherType,
        voucherCode: data.voucherCode,
        voucherImage: fileInfo,
      };
      return this.voucherService.editVoucher(voucherId, data);
    } else return 'provide valid data';
  }

  @Delete('remove-single')
  deleteSingleVoucher(@Query('voucherObjectId') voucherObjectId) {
    return this.voucherService.deleteSingleVoucher(voucherObjectId);
  }
  @Delete('remove-all')
  deleteAllVoucher(@Query('voucherId') voucherId) {
    return this.voucherService.deleteAllVoucher(voucherId);
  }

  @Post('redeem')
  redeemVoucher(
    @Query('userId') userId,
    @Query('voucherId') voucherId,
    @Query('restaurantId') restaurantId,
    @Query('verificationCode') verificationCode,
  ) {
    return this.voucherService.redeemVoucher(
      userId,
      voucherId,
      restaurantId,
      verificationCode,
    );
  }

  @Get('all-redeemed-by-user')
  getAllVoucherRedeemedByUser(@Query('userId') userId) {
    return this.voucherService.getAllVoucherRedeemedByUser(userId);
  }

  @Get('ask-for-restaurant-code')
  askForRestaurantCode(@Query('restaurantId') restaurantId) {
    return this.voucherService.askForRestaurantCode(restaurantId);
  }
  @Post('verify-restaurant-code')
  verifyRestaurantCode(
    @Query('restaurantId') restaurantId,
    @Query('restaurantCode') restaurantCode,
  ) {
    return this.voucherService.verifyRestaurantCode(
      restaurantId,
      restaurantCode,
    );
  }
}

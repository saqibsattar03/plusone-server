import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Get, Post } from '@nestjs/common/decorators';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  UpdateVoucherDto,
  VoucherDto,
} from '../../../../data/dtos/voucher.dto';
import { ProfileDto } from '../../../../data/dtos/profile.dto';

@ApiTags('Voucher')
@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('create')
  @ApiBody({
    type: VoucherDto,
    description: 'Request body to create a Voucher for student',
  })
  @ApiCreatedResponse({
    type: VoucherDto,
    description: 'Created Voucher object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create voucher' })
  createStudentVoucher(@Body() data, @Query('type') type) {
    console.log(type);
    if (type == 'STUDENT') {
      data.voucherObject.voucherType = type;
      if (data.voucherObject.voucherImage) {
        return this.voucherService.createStudentVoucher(data);
      } else
        throw new HttpException(
          'Picture must be provided to create voucher',
          HttpStatus.NOT_ACCEPTABLE,
        );
    } else if (type == 'NON-STUDENT') {
      data.voucherObject.voucherType = type;
      if (data.voucherObject.voucherImage) {
        return this.voucherService.createStudentVoucher(data);
      } else return 'Picture must be provided to create voucher';
    }
    // } else if (type == 'BOTH') {
    //   data.voucherObject.voucherType = type;
    //   if (data.voucherObject.voucherImage) {
    //     return this.voucherService.createStudentVoucher(data);
    //   } else return 'Picture must be provided to create voucher';
    // }
  }
  @Post('create-for-non-student')
  @ApiBody({
    type: VoucherDto,
    description: 'Request body to create a Voucher for non-student',
  })
  @ApiCreatedResponse({
    type: VoucherDto,
    description: 'Created Voucher object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create voucher' })
  createNonStudentVoucher(@Body() data) {
    if (data.voucherObject.voucherImage) {
      return this.voucherService.createNonStudentVoucher(data);
    }
    throw new HttpException(
      'Picture must be provided to create voucher',
      HttpStatus.BAD_REQUEST,
    );
  }

  @Get('get-all-vouchers-by-restaurant')
  @ApiQuery({ type: 'string', name: 'restaurantId' })
  @ApiQuery({ type: 'string', name: 'voucherType' })
  @ApiCreatedResponse({ type: VoucherDto })
  @ApiBadRequestResponse({ description: 'can not fetch voucher' })
  getAllVouchersByRestaurant(@Query('restaurantId') restaurantId) {
    return this.voucherService.getAllVouchersByRestaurant(restaurantId);
  }
  @Patch('')
  @ApiQuery({ type: 'string', name: 'voucherId' })
  @ApiBody({ type: UpdateVoucherDto })
  @ApiCreatedResponse({ type: VoucherDto })
  @ApiBadRequestResponse({ description: 'can not update voucher' })
  editVoucher(@Body() data, @Query('voucherId') voucherId) {
    return this.voucherService.editVoucher(voucherId, data);
  }

  @Delete('remove-single')
  @ApiQuery({ type: 'string', name: 'voucherObjectId' })
  @ApiCreatedResponse({
    description: 'single voucher object deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'can not delete voucher' })
  deleteSingleVoucher(@Query('voucherObjectId') voucherObjectId) {
    return this.voucherService.deleteSingleVoucher(voucherObjectId);
  }
  @Delete('remove-all')
  @ApiQuery({ type: 'string', name: 'restaurantId' })
  @ApiCreatedResponse({
    description: 'all vouchers of restaurant deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'can not delete voucher' })
  deleteAllVoucher(@Query('restaurantId') restaurantId) {
    return this.voucherService.deleteAllVoucher(restaurantId);
  }

  @Get('ask-for-restaurant-code')
  @ApiQuery({ type: 'string', name: 'restaurantId' })
  @ApiCreatedResponse({ type: 'object' })
  @ApiBadRequestResponse({ description: 'can not retrieve code' })
  askForRestaurantCode(@Query('restaurantId') restaurantId) {
    return this.voucherService.askForRestaurantCode(restaurantId);
  }
  @Post('verify-restaurant-code')
  @ApiQuery({ type: 'string', name: 'restaurantId' })
  @ApiQuery({ type: 'string', name: 'restaurantCode' })
  @ApiCreatedResponse({ type: Number })
  @ApiBadRequestResponse({ description: 'can not verify restaurant code' })
  verifyRestaurantCode(
    @Query('restaurantId') restaurantId,
    @Query('restaurantCode') restaurantCode,
  ) {
    return this.voucherService.verifyRestaurantCode(
      restaurantId,
      restaurantCode,
    );
  }

  @Post('redeem')
  @ApiQuery({ type: 'string', name: 'userId' })
  @ApiQuery({ type: 'string', name: 'voucherId' })
  @ApiQuery({ type: 'string', name: 'restaurantId' })
  @ApiQuery({ type: 'string', name: 'verificationCode' })
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

  @Get('redeem-count')
  getTotalVoucherRedeemedCount(@Query('restaurantId') restaurantId) {
    return this.voucherService.getTotalVoucherRedeemedCount(restaurantId);
  }

  @Get('redeemed-by-all-users')
  @ApiCreatedResponse({
    type: ProfileDto,
    description: 'All Users',
  })
  @ApiQuery({ name: 'voucherId', type: 'string' })
  @ApiBadRequestResponse({
    description: 'can not get users who redeemed the voucher',
  })
  getUserWhoRedeemVoucher(@Query('voucherId') voucherId) {
    return this.voucherService.getUserWhoRedeemVoucher(voucherId);
  }
}

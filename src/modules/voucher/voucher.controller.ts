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
import { UpdateVoucherDto, VoucherDto } from '../../data/dtos/voucher.dto';
import { ProfileDto } from '../../data/dtos/profile.dto';
import { Constants } from '../../common/constants';

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
  createStudentVoucher(@Body() data) {
    switch (data.voucherObject.voucherPreference) {
      case Constants.STUDENT:
        if (data.voucherObject.voucherImage) {
          return this.voucherService.createStudentVoucher(data);
        } else
          throw new HttpException(
            'Picture must be provided to create voucher',
            HttpStatus.NOT_ACCEPTABLE,
          );
      case Constants.NONSTUDENT:
        if (data.voucherObject.voucherImage) {
          return this.voucherService.createNonStudentVoucher(data);
        } else
          throw new HttpException(
            'Picture must be provided to create voucher',
            HttpStatus.NOT_ACCEPTABLE,
          );
      case Constants.BOTH:
        if (data.voucherObject.voucherImage) {
          return this.voucherService.createVoucherForBoth(data);
        } else
          throw new HttpException(
            'Picture must be provided to create voucher',
            HttpStatus.NOT_ACCEPTABLE,
          );
    }
  }
  @Get('all-by-restaurant')
  @ApiQuery({ type: 'string', name: 'restaurantId' })
  @ApiCreatedResponse({ type: VoucherDto })
  @ApiBadRequestResponse({ description: 'can not fetch voucher' })
  getAllVouchersByRestaurant(@Query('restaurantId') restaurantId) {
    return this.voucherService.getAllVouchersByRestaurant(restaurantId);
  }

  @Get('single')
  @ApiQuery({ type: 'string', name: 'voucherId' })
  @ApiCreatedResponse({ type: VoucherDto })
  @ApiBadRequestResponse({ description: 'can not fetch voucher' })
  getSingleVoucher(@Query('voucherId') voucherId) {
    return this.voucherService.getSingleVoucher(voucherId);
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

  @Post('verify-restaurant-code')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        restaurantId: { type: 'string' },
        userId: { type: 'string' },
        restaurantCode: { type: 'number' },
        voucherId: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ type: Number, description: 'return 4 digit code ' })
  @ApiBadRequestResponse({ description: 'can not verify restaurant code' })
  verifyRestaurantCode(@Body() data) {
    return this.voucherService.verifyRestaurantCode(data);
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

  @Patch('disable')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        voucherId: { type: 'string' },
        voucherDisableDates: {
          type: 'string',
          example: ['20-12-23', '20-12-23'],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'can not disable voucher',
  })
  voucherDisableDates(@Body() data) {
    return this.voucherService.disableVoucherForSpecificDays(data);
  }

  @ApiQuery({ type: String, name: 'restaurantId', required: false })
  @Get('all-redeemed')
  getRedeemedVoucher(@Query('restaurantId') restaurantId) {
    return this.voucherService.getAllRedeemedVouchers(restaurantId);
  }
}
import { Body, Controller, Delete, Patch, Query } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Get, Post } from '@nestjs/common/decorators';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@ApiTags('Voucher')
@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('create-for-student')
  @ApiBody({
    type: CreateVoucherDto,
    description: 'Request body to create a Voucher for student',
  })
  @ApiCreatedResponse({
    type: CreateVoucherDto,
    description: 'Created Voucher object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create voucher' })
  createStudentVoucher(@Body() data) {
    if (data.voucherObject.voucherImage) {
      return this.voucherService.createStudentVoucher(data);
    } else return 'Picture must be provided to create voucher';
  }
  @Post('create-for-non-student')
  @ApiBody({
    type: CreateVoucherDto,
    description: 'Request body to create a Voucher for non-student',
  })
  @ApiCreatedResponse({
    type: CreateVoucherDto,
    description: 'Created Voucher object as response',
  })
  @ApiBadRequestResponse({ description: 'can not create voucher' })
  createNonStudentVoucher(@Body() data) {
    if (data.voucherObject.voucherImage) {
      return this.voucherService.createNonStudentVoucher(data);
    } else return 'Picture must be provided to create voucher';
  }

  @Get('get-all-vouchers-by-restaurant')
  @ApiQuery({ type: 'string', name: 'restaurantId' })
  @ApiQuery({ type: 'string', name: 'voucherType' })
  @ApiCreatedResponse({ type: CreateVoucherDto })
  @ApiBadRequestResponse({ description: 'can not fetch voucher' })
  getAllVouchersByRestaurant(
    @Query('restaurantId') restaurantId,
    @Query('voucherType') voucherType,
  ) {
    return this.voucherService.getAllVouchersByRestaurant(
      restaurantId,
      voucherType,
    );
  }
  @Patch('')
  @ApiQuery({ type: 'string', name: 'voucherId' })
  @ApiBody({ type: UpdateVoucherDto })
  @ApiCreatedResponse({ type: CreateVoucherDto })
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
  @ApiQuery({ type: 'string', name: 'voucherId' })
  @ApiCreatedResponse({
    description: 'all vouchers of restaurant deleted successfully',
  })
  @ApiBadRequestResponse({ description: 'can not delete voucher' })
  deleteAllVoucher(@Query('voucherId') voucherId) {
    return this.voucherService.deleteAllVoucher(voucherId);
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
}

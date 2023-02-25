import { Body, Controller, Delete, Patch, Query } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Get, Post } from '@nestjs/common/decorators';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('create')
  createVoucher(@Body() data) {
    return this.voucherService.createVoucher(data);
  }

  @Get('get-all-vouchers-by-restaurant')
  getAllVouchesByRestaurant(@Query('restaurantId') restaurantId) {
    return this.voucherService.getAllVouchesByRestaurant(restaurantId);
  }
  @Patch('edit')
  editVoucher(@Body() data, @Query('voucherId') voucherId) {
    return this.voucherService.editVoucher(voucherId, data);
  }

  @Delete('remove')
  deleteVoucher(@Query('voucherId') voucherId) {
    return this.voucherService.deleteVoucher(voucherId);
  }
}

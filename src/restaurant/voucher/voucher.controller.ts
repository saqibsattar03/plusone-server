import { Body, Controller, Delete, Patch, Query } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { Get, Post } from '@nestjs/common/decorators';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('create-for-student')
  createStudentVoucher(@Body() data) {
    return this.voucherService.createStudentVoucher(data);
  }
@Post('create-for-non-student')
  createNonStudentVoucher(@Body() data) {
    return this.voucherService.createNonStudentVoucher(data);
  }

  @Get('get-all-vouchers-by-restaurant')
  getAllVouchesByRestaurant(@Query('restaurantId') restaurantId) {
    return this.voucherService.getAllVouchesByRestaurant(restaurantId);
  }
  @Patch('edit')
  editVoucher(@Body() data, @Query('voucherId') voucherId) {
    return this.voucherService.editVoucher(voucherId, data);
  }

  @Delete('remove-single')
  deleteSingleVoucher(@Query('voucherObjectId') voucherObjectId){
    return this.voucherService.deleteSingleVoucher(voucherObjectId)
  }
  @Delete('remove-all')
  deleteAllVoucher(@Query('voucherId') voucherId) {
    return this.voucherService.deleteAllVoucher(voucherId);
  }
}

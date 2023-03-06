export class VoucherDto {
  restaurantId: any;
  voucherObject: {
    _id: any;
    discount: number;
    description: string;
    voucherType: string;
    voucherCode: number;
    voucherImage: {
      fileName: string;
      filePath: string;
    };
  };
}

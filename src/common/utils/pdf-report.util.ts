// import { Injectable } from '@nestjs/common';
// import { createWriteStream } from 'fs';
// import * as PDFDocument from 'pdfkit';
// import { AwsMailUtil } from './aws-mail-util';
// import * as fs from 'fs';
// import * as blobStream from 'blob-stream';
// @Injectable()
// export class PdfReportUtil {
//   async createInvoice(invoice: any, path: string): Promise<any> {
//     const doc = new PDFDocument({ size: 'A4', margin: 50 });
//     await this.generateInvoiceHeader(doc);
//     this.generateDetails(doc, invoice);
//     this.generateInvoiceTable(doc, invoice);
//     await this.generateInvoiceFooter(doc);
//     const stream = doc.pipe(blobStream());
//     doc.end();
//     // const pdfBlob = stream.toBlob();
//     const chunks: Uint8Array[] = [];
//     // Read the PDF blob
//     doc.on('data', (chunk) => chunks.push(chunk));
//     doc.on('end', async () => {
//       const pdfBuffer = Buffer.concat(chunks);
//       const pdfContent = pdfBuffer.toString('base64');
//       await new AwsMailUtil().sendEmailWithAttachment(pdfContent);
//     });
//
//     doc.on('error', (error) => {
//       console.log(error);
//     });
//   }
//
//   //*** header for PDF file ***//
//   async generateInvoiceHeader(doc: any): Promise<any> {
//     doc
//       .image('logo.png', 50, 45, { width: 50 })
//       .fillColor('#444444')
//       .fontSize(20)
//       .text('PlusOne Inc.', 110, 57)
//       .fontSize(10)
//       .text('PlusOne Inc.', 200, 50, { align: 'right' })
//       .text('123 Main Street', 200, 65, { align: 'right' })
//       .text('Amsterdam, North, 10025', 200, 80, { align: 'right' })
//       .moveDown();
//   }
//
//   //*** Footer for PDF file ***//
//   async generateInvoiceFooter(doc: any): Promise<any> {
//     console.log('write invoice footer here');
//     await doc
//       .fontSize(10)
//       .text(
//         'Payment is due within 15 days. Thank you for your business.',
//         50,
//         780,
//         { align: 'center', width: 500 },
//       );
//   }
//
//   generateDetails(doc, invoice) {
//     console.log(invoice);
//     // *** Reference Code ***//
//     doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160);
//
//     this.generateHr(doc, 185);
//
//     const customerInformationTop = 200;
//
//     doc
//       .fontSize(10)
//       .text('Invoice Number:', 50, customerInformationTop)
//       .font('Helvetica-Bold')
//       .text(15, 150, customerInformationTop)
//       .font('Helvetica')
//       .text('Invoice Date:', 50, customerInformationTop + 15)
//       .text(this.formatDate(new Date()), 150, customerInformationTop + 15)
//       .text('Current Balance:', 50, customerInformationTop + 30)
//       .text(
//         this.formatCurrency(invoice.availableDeposit),
//         150,
//         customerInformationTop + 30,
//       )
//
//       .font('Helvetica-Bold')
//       .text(invoice[0].restaurantId.restaurantName, 300, customerInformationTop)
//       .font('Helvetica')
//       .text('Gulshan Market Multan', 300, customerInformationTop + 15)
//       .text(
//         'Amsterdam' + ', ' + 'North Holland' + ', ' + 'Netherlands',
//         300,
//         customerInformationTop + 30,
//       )
//       .moveDown();
//     this.generateHr(doc, 252);
//   }
//
//   generateTableRow(
//     doc,
//     y,
//     voucherType,
//     amount,
//     deductedAmount,
//     date,
//     transactionType,
//     currentBalance,
//   ) {
//     // column heading names
//     doc
//       .fontSize(10)
//       .text(voucherType, 50, y)
//       .text(amount, 130, y)
//       .text(deductedAmount, 200, y, { width: 90, align: 'right' })
//       .text(date, 280, y, { width: 90, align: 'right' })
//       .text(transactionType, 360, y, { width: 90, align: 'right' })
//       .text(currentBalance, 0, y, { align: 'right' });
//   }
//
//   generateInvoiceTable(doc, invoice) {
//     let i;
//     const invoiceTableTop = 330;
//     doc.font('Helvetica-Bold');
//     this.generateTableRow(
//       doc,
//       invoiceTableTop,
//       'Voucher Type',
//       'Amount',
//       'Deduction',
//       'Date',
//       'Debit/Credit',
//       'Current Balance',
//     );
//     this.generateHr(doc, invoiceTableTop + 20);
//     doc.font('Helvetica');
//
//     for (i = 0; i < invoice.length; i++) {
//       const item = invoice[i];
//       const position = invoiceTableTop + (i + 1) * 30;
//       this.generateTableRow(
//         doc,
//         position,
//         item.voucherType ? item.voucherType : '-',
//         this.formatCurrency(item.amount),
//         item.deductedAmount ? this.formatCurrency(item.deductedAmount) : '-',
//         this.formatDate(item.createdAt),
//         item.transactionType,
//         this.formatCurrency(item.availableDeposit),
//       );
//       this.generateHr(doc, position + 20);
//       // Check if the content exceeds the page boundaries
//     }
//     const subtotalPosition = invoiceTableTop + (i + 1) * 30;
//     this.generateTableRow(
//       doc,
//       subtotalPosition,
//       '',
//       '',
//       '',
//       'Subtotal',
//       '',
//       parseFloat(invoice[0].availableDeposit).toFixed(2),
//     );
//     const paidToDatePosition = subtotalPosition + 20;
//     this.generateTableRow(
//       doc,
//       paidToDatePosition,
//       '',
//       '',
//       '',
//       'Paid To Date',
//       '',
//       parseFloat(invoice[0].restaurantId.totalDeposit).toFixed(2),
//     );
//
//     const grandTotalPosition = paidToDatePosition + 20;
//     this.generateTableRow(
//       doc,
//       grandTotalPosition,
//       '',
//       '',
//       '',
//       'Grand Total After Deductions',
//       '',
//       this.calculateGrandTotal(invoice),
//     );
//   }
//
//   calculateGrandTotal(invoice) {
//     if (invoice[0].availableDeposit < 0) {
//       return '-' + parseFloat(invoice[0].availableDeposit).toFixed(2);
//     } else {
//       return (
//         invoice[0].availableDeposit - invoice[0].restaurantId.totalDeductions
//       ).toFixed(2);
//     }
//   }
//   private checkPageOverflow(doc): boolean {
//     const pageHeight = 841.89; // A4 page height in points (1 point = 1/72 inch)
//     const marginBottom = 50; // Margin at the bottom of the page in points
//
//     return doc.y > pageHeight - marginBottom;
//   }
//
//   generateHr(doc, y) {
//     doc
//       .strokeColor('#aaaaaa')
//       .lineWidth(1)
//       .moveTo(50, y)
//       .lineTo(550, y)
//       .stroke();
//   }
//   formatCurrency(amount) {
//     return '€' + parseFloat(amount).toFixed(2);
//   }
//
//   formatDate(date) {
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//
//     return year + '/' + month + '/' + day;
//   }
// }

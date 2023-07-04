import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { AwsMailUtil } from './aws-mail-util';
import * as blobStream from 'blob-stream';
import { getRandomNumber } from './generateRandomNumber.util';
import { Constants } from '../constants';
@Injectable()
export class PdfReportUtil {
  async createInvoice(invoice: any): Promise<any> {
    const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
    await this.generateInvoiceHeader(doc);
    await this.generateDetails(doc, invoice);
    await this.generateInvoiceTable(doc, invoice);
    await this.generateInvoiceFooter(doc);
    doc.pipe(blobStream());
    doc.end();

    const chunks: Uint8Array[] = [];
    // Read the PDF blob
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(chunks);
      const pdfContent = pdfBuffer.toString('base64');
      await new AwsMailUtil().sendEmailWithAttachment(
        pdfContent,
        invoice[0].restaurantId.userId.email,
      );
    });

    doc.on('error', (error) => {
      console.log(error);
    });
  }

  //*** header for PDF file ***//
  async generateInvoiceHeader(doc: any): Promise<any> {
    doc
      .image('logo.png', 50, 45, { width: 50, height: 30 })
      .fillColor('#444444')
      .fontSize(20)
      .text('PlusOne Worldwide.', 110, 52)
      .fontSize(10)
      .text('PlusOne Worldwide.', 200, 50, { align: 'right' })
      .text('123 Main Street', 200, 65, { align: 'right' })
      .text('Amsterdam, North, 10025', 200, 80, { align: 'right' })
      .moveDown();
  }

  //*** Footer for PDF file ***//
  generateInvoiceFooter(doc: any) {
    doc.fontSize(10).text('Thank you for your business.', 50, 750, {
      align: 'center',
      width: 500,
    });
    this.generateHr(doc, 765);
    doc
      .fontSize(10)
      .text(
        'This is Computer Generated Statement no Signature required',
        50,
        775,
        {
          align: 'center',
        },
      );
    // doc.fontSize(7).text('Developed By SparkoSol', 55, 782, {
    //   align: 'right',
    // });
  }

  //*** generating details of invoice section ***//
  async generateDetails(doc, invoice) {
    // *** Reference Code ***//
    doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160);

    // divider //
    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .text('Invoice Number:', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(await getRandomNumber(1, 500), 150, customerInformationTop)
      .font('Helvetica')
      .text('Invoice Date:', 50, customerInformationTop + 15)
      .text(this.formatDate(new Date()), 150, customerInformationTop + 15)
      .text('Contact Number:', 50, customerInformationTop + 30)
      .text(
        invoice[0].restaurantId.phoneNumber,
        150,
        customerInformationTop + 30,
      )

      .font('Helvetica-Bold')
      .text(invoice[0].restaurantId.restaurantName, 300, customerInformationTop)
      .font('Helvetica')
      .text('Gulshan Market Multan', 300, customerInformationTop + 15)
      .text(
        'Amsterdam' + ', ' + 'North Holland' + ', ' + 'Netherlands',
        300,
        customerInformationTop + 30,
      )
      .moveDown();
    this.generateHr(doc, 252);
  }

  //*** generating details of pdf file data ***//
  generateTableRowData(
    doc,
    y,
    voucherType,
    amount,
    deductedAmount,
    date,
    transactionType,
    currentBalance,
  ) {
    // column heading names
    doc
      .fontSize(10)
      .text(voucherType, 50, y)
      .text(amount, 130, y)
      .text(deductedAmount, 200, y, { width: 90, align: 'right' })
      .text(date, 280, y, { width: 90, align: 'right' })
      .text(transactionType, 360, y, { width: 90, align: 'right' })
      .text(currentBalance, 0, y, { align: 'right' });
  }

  async generateInvoiceTable(doc, invoice) {
    let i;
    let index = 1;
    let invoiceTableTop = 335;
    doc.font('Helvetica-Bold');
    this.generateTableRowData(
      doc,
      invoiceTableTop,
      'Voucher Type',
      'Amount',
      'Deduction',
      'Date',
      'Debit/Credit',
      'Current Balance',
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    for (i = 0; i < invoice.length - 1; i++) {
      const item = invoice[i];
      //check here tomorrow
      let position = invoiceTableTop + index * 30;
      index++;
      if (position >= 755) {
        index = 1;
        position = 30;
        invoiceTableTop = 30;
        doc.addPage({
          size: 'A4',
          margin: 50,
        });
      }
      this.generateTableRowData(
        doc,
        position,
        item.voucherType ? item.voucherType : '-',
        this.formatCurrency(item.amount),
        item.deductedAmount ? this.formatCurrency(item.deductedAmount) : '-',
        this.formatDate(item.createdAt),
        item.transactionType,
        this.formatCurrency(item.availableDeposit),
      );
      this.generateHr(doc, position + 20);
    }
    const subtotalPosition = invoiceTableTop + index * 30;
    this.generateTableRowData(
      doc,
      subtotalPosition,
      '',
      '',
      '',
      'Subtotal',
      '',
      '€ ' + (await this.calculateSubtotalAmount(invoice)),
    );
    const availableBalancePosition = subtotalPosition + 20;
    this.generateTableRowData(
      doc,
      availableBalancePosition,
      '',
      '',
      '',
      'Available Balance',
      '',
      '€ ' + parseFloat(invoice[0].restaurantId.availableDeposit).toFixed(2),
    );
    const amountToDeductPosition = availableBalancePosition + 20;
    this.generateTableRowData(
      doc,
      amountToDeductPosition,
      '',
      '',
      '',
      'Amount to Deduct',
      '',
      // '€ ' + parseFloat(invoice[0].restaurantId.availableDeposit).toFixed(2),
      '€ ' + this.calculateDebitAmount(invoice),
    );

    const grandTotalPosition = amountToDeductPosition + 20;
    doc.font('Helvetica-Bold');
    this.generateTableRowData(
      doc,
      grandTotalPosition,
      '',
      '',
      '',
      'Grand Total',
      '',
      '€ ' + this.calculateGrandTotal(invoice),
    );
    doc.font('Helvetica');
  }

  generateHr(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
  formatCurrency(amount) {
    return '€ ' + parseFloat(amount).toFixed(2);
  }
  calculateGrandTotal(invoice) {
    const { DEBIT, CREDIT } = Constants;
    let debitSum = 0;
    let creditSum = 0;

    for (let i = 0; i < invoice.length; i++) {
      const { transactionType, amount } = invoice[i];
      if (transactionType === DEBIT) {
        debitSum += amount;
      } else if (transactionType === CREDIT) {
        creditSum += amount;
      }
    }

    const grandTotal = creditSum - debitSum;
    return grandTotal.toFixed(2);
  }

  calculateDebitAmount(invoice) {
    console.log('invoice = ', invoice);
    let sum = 0;
    for (let i = 0; i < invoice.length; i++) {
      if (invoice[i].transactionType === Constants.DEBIT) {
        sum += invoice[i].amount;
        console.log('sum = ', sum);
      }
    }
    return sum.toFixed(2);
  }
  async calculateSubtotalAmount(invoice) {
    let sum = 0;
    for (let i = 0; i < invoice.length; i++) {
      sum = sum + invoice[i].amount;
    }
    return sum.toFixed(2);
  }
  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + '/' + month + '/' + day;
  }
}

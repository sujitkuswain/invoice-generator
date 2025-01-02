import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClientsService } from './clients.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  websiteUrl = 'mosahar.com';
  contact = 'mosahar.boudh@gmail.com';
  companyName = 'moSahar';
  todayDate: Date = new Date();
  formattedDateForDisplay: string = '';
  formattedDateForInvoice: string = '';
  invoiceNumber: string = '';

  // Generate custom PDF layout
  generateCustomPDF(formData: any) {
    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.width;

    // Header section with logo and title
    const logo = new Image();
    logo.src = 'assets/images/logo.png';

    // Logo
    const logoWidth = 10;
    const logoHeight = 10;
    const logoX = 10;
    const logoY = 10;

    // Text
    const padding = 3; // Add some space between the logo and the text
    const textX = logoX + logoWidth + padding; // Place the text right after the logo
    const textY = logoY + logoHeight / 2; // Vertically center the text

    // Add logo and text to the PDF
    pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight); // Logo at the top-left corner
    pdf.text(this.companyName, textX, textY); // Company name placed next to the logo

    pdf.setFontSize(20);
    pdf.text('INVOICE', 80, 20); // Centered title
    pdf.setFontSize(12);
    this.generateInvoiceNumber();
    this.formatDateForDisplay();
    pdf.text(
      `Invoice Number: MS-${this.formattedDateForInvoice}`,
      this.getXPosition(
        pdf,
        `Invoice Number: MS-${this.formattedDateForInvoice}`,
        'R'
      ),
      40
    ); // Invoice number
    pdf.text(
      `Date: ${this.formattedDateForDisplay}`,
      this.getXPosition(pdf, `Date: ${this.formattedDateForDisplay}`, 'R'),
      50
    ); // Current date

    // Client details section
    pdf.setFontSize(12);
    pdf.text(
      `Client Name: ${this.clientsService.getClientViewValue(
        formData.clientName
      )}`,
      10,
      40
    );
    pdf.text(`Billing Period: ${formData.billingPeriod}`, 10, 50);

    // Service details table
    autoTable(pdf, {
      head: [['Service', 'Price', 'Discount %', 'Final Price']],
      body: formData.services.map((service: any) => [
        service.service || '',
        service.price || '0',
        this.handleDiscount(service.discount),
        `${service.finalPrice || '0'}`,
      ]),
      startY: 70,
    });

    // Calculate the Y position of the table footer (the total)
    const finalY = pdf.lastAutoTable.finalY || 90; // Adjust based on table's end position

    // Align the Total text to the right edge of the page, same as last column
    pdf.text(
      `Total: ${formData.total}`,
      this.getXPosition(pdf, `Total: ${formData.total}`, 'R') - 5,
      finalY + 10
    );

    pdf.text(`Contact: ${this.contact}`, 10, finalY + 20);
    pdf.text(`Website: ${this.websiteUrl}`, 10, finalY + 30);

    // Save PDF
    pdf.save(`invoice-${formData.invoiceNumber}.pdf`);
  }

  // Helper function to calculate the final price after discount
  calculateFinalPrice(price: number, discount: number): number {
    const discountAmount = (price * discount) / 100;
    return +(price - discountAmount).toFixed(2);
  }

  generateInvoiceNumber() {
    this.formattedDateForInvoice = this.datePipe.transform(
      this.todayDate,
      'ddMMyyyyhhmmss'
    )!;
    this.invoiceNumber = 'MS-' + this.formattedDateForInvoice;
  }

  formatDateForDisplay() {
    this.formattedDateForDisplay = this.datePipe.transform(
      this.todayDate,
      'dd-MM-yyyy'
    )!;
  }

  getXPosition(pdf: jsPDF, text: string, position: 'L' | 'C' | 'R'): number {
    const pageWidth = pdf.internal.pageSize.width; // Get the page width
    const textWidth = pdf.getTextWidth(text); // Get the width of the text

    switch (position) {
      case 'L':
        return 10; // Left position, with a small margin from the left edge
      case 'C':
        return (pageWidth - textWidth) / 2; // Center position
      case 'R':
        return pageWidth - textWidth - 10; // Right position, with a small margin from the right edge
      default:
        return 10; // Default to left if no valid position is given
    }
  }

  constructor(
    private datePipe: DatePipe,
    private clientsService: ClientsService
  ) {}

  handleDiscount(discount: any): string {
    if (discount === 100) {
      return 'FREE';
    } else if (discount === null || discount === 0) {
      return '';
    } else if (typeof discount === 'number') {
      return `${discount}%`;
    }
    return '';
  }
}

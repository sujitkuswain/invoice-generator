import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  // Generate custom PDF layout
  generateCustomPDF() {
    const pdf = new jsPDF();

    // Adding custom header
    pdf.setFontSize(20);
    pdf.text('Custom Invoice', 10, 10);

    // Adding client details
    pdf.setFontSize(12);
    pdf.text('Client Name: Yummy Bakery and Sweets', 10, 20);
    pdf.text('Billing Period: 01-Nov-2024 to 30-Nov-2024', 10, 30);

    // Adding service table
    autoTable(pdf, {
      head: [['Service', 'Price', 'Discount']],
      body: [
        ['Service A', '1000', '10%'],
        ['Service B', '2000', '5%'],
      ],
      startY: 50,
    });

    // Footer
    pdf.text(
      'Thank you for your business!',
      10,
      pdf.internal.pageSize.height - 10
    );

    pdf.save('invoice-custom.pdf');
  }

  constructor() {}

  generatePDF() {
    const content: HTMLElement = document.getElementById('header')!;
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // A4 page width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('invoice.pdf');
    });
  }
}

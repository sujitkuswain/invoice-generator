// src/types/jspdf-autotable.d.ts
declare module 'jspdf-autotable' {
  import jsPDF from 'jspdf';

  export interface AutoTableOptions {
    head: Array<Array<string>>;
    body: Array<Array<string>>;
    startY?: number;
    margin?: { top?: number; left?: number; right?: number; bottom?: number };
    theme?: 'striped' | 'grid' | 'plain';
  }

  export default function autoTable(
    doc: jsPDF,
    options: AutoTableOptions
  ): void;
}

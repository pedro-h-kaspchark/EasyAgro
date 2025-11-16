import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFColumn {
  header: string;
  key: string;
  width?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PDFGeneratorService {

  private formatDateBR(dateStr?: string): string {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR');
  }

  private groupByMonth(items: any[], dateField: string) {
    const grouped: any = {};

    for (const item of items) {
      const rawDate = item[dateField];
      const d = rawDate ? new Date(rawDate) : new Date();
      const monthKey = d.toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric'
      });

      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(item);
    }

    return grouped;
  }

  generateMonthlyReport(
    title: string,
    farmName: string,
    items: any[],
    columns: PDFColumn[],
    dateField: string = 'date'
  ) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    let cursorY = 40;

    // ===== TÍTULO =====
    doc.setFontSize(18);
    doc.text(title, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 25;

    // ===== FAZENDA =====
    doc.setFontSize(12);
    doc.text(`Fazenda: ${farmName}`, 40, cursorY);
    cursorY += 20;

    // ===== AGRUPAMENTO =====
    const grouped = this.groupByMonth(items, dateField);
    const months = Object.keys(grouped);

    for (const month of months) {
      cursorY += 15;

      doc.setFont("helvetica", "bold");
      doc.text(month, 40, cursorY);
      doc.setFont("helvetica", "normal");
      cursorY += 10;

      const rows = grouped[month].map((row: any) =>
        columns.map(col =>
          col.key === dateField
            ? this.formatDateBR(row[col.key])
            : (row[col.key] ?? '--')
        )
      );

      autoTable(doc, {
        startY: cursorY,
        head: [columns.map(col => col.header)],
        body: rows,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [230, 230, 230] },
        margin: { left: 40, right: 40 }
      });

      cursorY = (doc as any).lastAutoTable.finalY + 20;
    }

    const filename = `${title.replace(/\s+/g, '_')}_${farmName.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
  }
}

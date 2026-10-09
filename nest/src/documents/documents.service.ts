import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { diffDays } from '../common/date.util';

export type DocStatus = 'safe' | 'soon' | 'expired';

@Injectable()
export class DocumentsService {
  constructor(private data: DataService) {}

  list() {
    // Pakai "today" dari konfigurasi (15 Mei 2026), BUKAN field "today" di dalam
    // mock-documents.json (31 Mei 2026) yang bertentangan dengan brief.
    const today = this.data.today;
    const warningDays: number = this.data.documents.thresholds?.warningDays ?? 30;

    const documents = this.data.documents.documents.map((d: any) => {
      const daysRemaining = diffDays(d.expiryDate, today);
      const status: DocStatus =
        daysRemaining <= 0 ? 'expired' : daysRemaining <= warningDays ? 'soon' : 'safe';
      return { id: d.id, label: d.label, expiryDate: d.expiryDate, daysRemaining, status };
    });
    return { today, warningDays, documents };
  }
}

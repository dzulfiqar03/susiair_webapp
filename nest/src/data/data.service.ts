import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// JSON di-import (bukan readFileSync) agar ikut ter-bundle di platform serverless
// seperti Vercel, yang tidak membawa file non-kode ke runtime.
import flightHoursData from './mock-flight-hours.json';
import documentsData from './mock-documents.json';
import schedulesData from './mock-schedules.json';

/** Memuat 3 file JSON ke memori saat service boot. */
@Injectable()
export class DataService implements OnModuleInit {
  /** date (YYYY-MM-DD) -> jam terbang */
  hoursByDate = new Map<string, number>();
  flightHours: any;
  documents: any;
  schedules: any;

  constructor(private config: ConfigService) {}

  /** "Hari ini" dikonfigurasi (APP_TODAY), bukan new Date(). */
  get today(): string {
    return this.config.get<string>('APP_TODAY') ?? '2026-05-15';
  }

  onModuleInit() {
    this.flightHours = flightHoursData;
    this.documents = documentsData;
    this.schedules = schedulesData;

    for (const row of this.flightHours.flightHours) {
      this.hoursByDate.set(row.date, Number(row.hours));
    }
  }
}
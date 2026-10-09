import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';

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
    const load = (f: string) =>
      JSON.parse(readFileSync(join(__dirname, f), 'utf-8'));
    this.flightHours = load('mock-flight-hours.json');
    this.documents = load('mock-documents.json');
    this.schedules = load('mock-schedules.json');

    for (const row of this.flightHours.flightHours) {
      this.hoursByDate.set(row.date, Number(row.hours));
    }
  }
}

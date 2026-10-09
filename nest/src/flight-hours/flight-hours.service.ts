import { BadRequestException, Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { addDays, eachDay, isValidIso } from '../common/date.util';
import { RangeKey } from './flight-hours.dto';

const round2 = (n: number) => Math.round(n * 100) / 100;

const CARD_WINDOWS = [
  { key: 'daily', label: 'Daily', window: 1 },
  { key: 'weekly', label: 'Weekly', window: 7 },
  { key: 'monthly', label: 'Monthly', window: 30 },
  { key: 'annual', label: 'Annual', window: 365 },
] as const;

@Injectable()
export class FlightHoursService {
  constructor(private data: DataService) {}

  /** Jam terbang satu hari. Hari tanpa data = 0 (tidak di-skip). */
  private hoursOn(date: string): number {
    return this.data.hoursByDate.get(date) ?? 0;
  }

  daily(from: string, to: string) {
    if (!isValidIso(from) || !isValidIso(to)) {
      throw new BadRequestException('from/to must be valid calendar dates');
    }
    if (from > to) throw new BadRequestException('"from" must be <= "to"');
    const dates = eachDay(from, to);
    if (dates.length > 800) throw new BadRequestException('Date range too large (max 800 days)');

    return {
      from,
      to,
      days: dates.map((date) => ({
        date,
        hours: round2(this.hoursOn(date)),
        isFuture: date > this.data.today,
      })),
    };
  }

  // this is a rolling sum calculation :)
  rollingWindowBluffing(endDate: string, windowDays: number): number {
    // Jumlah jam pada [endDate - (windowDays - 1), endDate].
    // - Hari tanpa data berkontribusi 0 (tanggal tidak di-skip).
    // - Window yang menjulur sebelum awal dataset (27 Des 2024): bagian di luar
    //   dataset dihitung 0 (partial window).
    // - Tanggal masa depan (> today): memakai data yang ada di dataset
    //   (dianggap rencana/penjadwalan), tanpa data = 0.
    let sum = 0;
    for (let i = 0; i < windowDays; i++) {
      sum += this.hoursOn(addDays(endDate, -i));
    }
    return sum;
  }

  summary(range: RangeKey) {
    const bounds = this.data.flightHours.chartBounds[range];
    const limits = this.data.flightHours.limits;
    const today = this.data.today;

    // 7 hari sebelum, hari ini, 7 hari sesudah -> today selalu di tengah (15 titik).
    const span = bounds.displayRangeDays ?? 7;
    const points = eachDay(addDays(today, -span), addDays(today, span)).map((date) => ({
      date,
      hours: round2(this.hoursOn(date)),
      rollingSum: round2(this.rollingWindowBluffing(date, bounds.windowDays)),
      isToday: date === today,
      isFuture: date > today,
    }));

    const cards = CARD_WINDOWS.map((c) => {
      const limit = limits[c.key];
      const hours = round2(this.rollingWindowBluffing(today, c.window));
      return {
        key: c.key,
        label: c.label,
        windowDays: c.window,
        hours,
        limit,
        percent: round2((hours / limit) * 100),
        exceeded: hours > limit,
      };
    });

    return {
      range,
      windowDays: bounds.windowDays,
      limit: bounds.limit,
      yMax: bounds.max,
      today,
      points,
      cards,
    };
  }
}

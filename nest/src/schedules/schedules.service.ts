import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';

@Injectable()
export class SchedulesService {
  constructor(private data: DataService) {}

  byMonth(year: number, month: number) {
    const prefix = `${year}-${String(month).padStart(2, '0')}-`;
    const schedules = this.data.schedules.schedules
      .filter((s: any) => s.duty_date.startsWith(prefix))
      .map((s: any) => ({
        ...s,
        remaining: Math.max(s.count_schedules - s.count_logbooks, 0),
        completed: s.count_logbooks === s.count_schedules,
      }));
    return { year, month, legend: this.data.schedules.legend, schedules };
  }
}

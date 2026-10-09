import { Controller, Get, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleQueryDto } from './schedules.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private svc: SchedulesService) {}

  @Get()
  list(@Query() q: ScheduleQueryDto) {
    return this.svc.byMonth(q.year, q.month);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { FlightHoursService } from './flight-hours.service';
import { RangeQueryDto, SummaryQueryDto } from './flight-hours.dto';

@Controller('flight-hours')
export class FlightHoursController {
  constructor(private svc: FlightHoursService) {}

  @Get('summary')
  summary(@Query() q: SummaryQueryDto) {
    return this.svc.summary(q.range);
  }

  @Get()
  daily(@Query() q: RangeQueryDto) {
    return this.svc.daily(q.from, q.to);
  }
}

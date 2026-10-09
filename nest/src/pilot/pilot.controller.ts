import { Controller, Get } from '@nestjs/common';
import { PilotService } from './pilot.service';

@Controller('pilot')
export class PilotController {
  constructor(private svc: PilotService) {}

  @Get('me')
  me() {
    return this.svc.me();
  }
}

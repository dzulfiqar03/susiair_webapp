import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';

@Injectable()
export class PilotService {
  constructor(private data: DataService) {}

  me() {
    const p = this.data.flightHours.pilot;
    return {
      name: p.name,
      // Total berasal dari file data (akumulasi seluruh dataset).
      totalFlightHours: p.totalFlightHours,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0E2138&color=fff&size=200&bold=true`,
    };
  }
}

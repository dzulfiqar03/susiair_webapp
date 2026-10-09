import { Controller, Get } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private svc: DocumentsService) {}

  @Get()
  list() {
    return this.svc.list();
  }
}

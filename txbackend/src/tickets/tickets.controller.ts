import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketStatus } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
async create(@Body() dto: CreateTicketDto) {
  return this.ticketsService.create(dto);
}

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Patch(':id/status')
    updateStatus(
    @Param('id') id: string,
    @Body() body: { status: TicketStatus; operatorId?: number },
  ) {
    return this.ticketsService.updateStatus(+id, body.status, body.operatorId);
  }
}

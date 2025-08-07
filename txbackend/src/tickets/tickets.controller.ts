import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketStatus } from './entities/ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() body: { serviceId: number; mobilePhone?: string }) {
    return this.ticketsService.create(body.serviceId, body.mobilePhone);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: TicketStatus }) {
    return this.ticketsService.updateStatus(+id, body.status);
  }
}

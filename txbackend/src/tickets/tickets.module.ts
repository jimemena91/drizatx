import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { Service } from 'src/services/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Service])], // ✅ esto es CLAVE
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService], // ✅ así otros módulos lo pueden usar
})
export class TicketsModule {}

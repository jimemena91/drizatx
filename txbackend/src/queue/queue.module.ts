import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Service } from '../services/entities/service.entity';
import { Operator } from '../operators/entities/operator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Service, Operator])], // ✅ CLAVE
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}

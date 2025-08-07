import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { TicketsModule } from '../tickets/tickets.module';
import { OperatorsModule } from '../operators/operators.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [TicketsModule, OperatorsModule, ServicesModule],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}

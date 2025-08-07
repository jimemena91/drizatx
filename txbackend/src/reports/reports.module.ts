import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TicketsModule } from '../tickets/tickets.module';
import { OperatorsModule } from '../operators/operators.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [TicketsModule, OperatorsModule, ServicesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

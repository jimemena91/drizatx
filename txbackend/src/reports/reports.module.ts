import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

import { Service } from '../services/entities/service.entity';
import { Operator } from '../operators/entities/operator.entity';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,    // ✅ necesario para que funcione @InjectRepository(Service)
      Operator,   // ✅ necesario también
    ]),
    TicketsModule, // ✅ porque usás TicketsService
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketsModule } from './tickets/tickets.module';
import { ServicesModule } from './services/services.module';
import { OperatorsModule } from './operators/operators.module';
import { QueueModule } from './queue/queue.module';
import { SettingsModule } from './settings/settings.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [TicketsModule, ServicesModule, OperatorsModule, QueueModule, SettingsModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

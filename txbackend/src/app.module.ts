import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketsModule } from './tickets/tickets.module';
import { ServicesModule } from './services/services.module';
import { OperatorsModule } from './operators/operators.module';
import { QueueModule } from './queue/queue.module';
import { SettingsModule } from './settings/settings.module';
import { ReportsModule } from './reports/reports.module';
import { Ticket } from './tickets/entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // o la IP de tu servidor MySQL
      port: 3306,
      username: 'root',
      password: 'jime1107',
      database: 'drizatx',
      autoLoadEntities: true,
       entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: true, // ⚠️ solo en desarrollo
    }),
    TicketsModule, ServicesModule, OperatorsModule, QueueModule, SettingsModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

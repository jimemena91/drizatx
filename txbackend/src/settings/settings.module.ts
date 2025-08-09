import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Settings } from './entities/settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])], // ✅ CLAVE
  controllers: [SettingsController], // ✅ NECESARIO
  providers: [SettingsService],
})
export class SettingsModule {}

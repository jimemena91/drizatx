import { Controller, Get, Patch, Body, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiTags } from '@nestjs/swagger';
import { Settings } from './entities/settings.entity';


@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

 @Put()
  updateAll(@Body() settings: Partial<Settings>) {
    return this.settingsService.updateAll(settings);
  }

 @Get()
  getAll() {
    return this.settingsService.findAll();
  }
}


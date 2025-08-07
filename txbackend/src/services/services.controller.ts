import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() data: Omit<Service, 'id'>) {
    return this.servicesService.create(data);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('active')
  findActive() {
    return this.servicesService.findActive();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Service>) {
    return this.servicesService.update(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.servicesService.delete(+id);
  }
}

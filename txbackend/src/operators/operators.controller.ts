import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { Operator } from './entities/operator.entity';

@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Post()
  create(@Body() data: Omit<Operator, 'id'>) {
    return this.operatorsService.create(data);
  }

  @Get()
  findAll() {
    return this.operatorsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Operator>) {
    return this.operatorsService.update(+id, data);
  }
}

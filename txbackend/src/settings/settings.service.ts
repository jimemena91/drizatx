import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from './entities/settings.entity';
import { Repository, FindOptionsWhere } from 'typeorm';

const DEFAULT_SETTINGS_ID = 1;

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  async findAll(): Promise<Settings> {
    const settings = await this.settingsRepository.findOne({
      where: { id: DEFAULT_SETTINGS_ID } as FindOptionsWhere<Settings>,
    });

    if (!settings) {
      throw new NotFoundException('Configuración no encontrada');
    }

    return settings;
  }

  async updateAll(partial: Partial<Settings>): Promise<Settings> {
    const current = await this.settingsRepository.findOne({
      where: { id: DEFAULT_SETTINGS_ID } as FindOptionsWhere<Settings>,
    });

    if (!current) {
      throw new NotFoundException('Configuración no encontrada');
    }

    Object.assign(current, partial);

    return this.settingsRepository.save(current);
  }
}

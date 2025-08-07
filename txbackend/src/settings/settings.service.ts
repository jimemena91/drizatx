import { Injectable } from '@nestjs/common';
import { Settings } from './entities/settings.entity';

@Injectable()
export class SettingsService {
  private settings: Settings = {
    maxWaitTime: 15,
    autoCallNext: true,
    soundEnabled: true,
    displayTimeout: 30,
    mobileEnabled: true,
    qrEnabled: true,
    notificationsEnabled: true,
  };

  get(): Settings {
    return this.settings;
  }

  update<K extends keyof Settings>(key: K, value: Settings[K]): Settings {
  this.settings[key] = value;
  return this.settings;
}
}
import { Module } from '@nestjs/common';
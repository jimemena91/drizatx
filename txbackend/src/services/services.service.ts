import { Injectable } from '@nestjs/common';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  private services: Service[] = [];
  private currentId = 1;

  create(data: Omit<Service, 'id'>): Service {
    const service: Service = { id: this.currentId++, ...data };
    this.services.push(service);
    return service;
  }

  findAll(): Service[] {
    return this.services;
  }

  findActive(): Service[] {
    return this.services.filter(s => s.active);
  }

  update(id: number, data: Partial<Service>): Service | null {
    const service = this.services.find(s => s.id === id);
    if (service) {
      Object.assign(service, data);
      return service;
    }
    return null;
  }

  delete(id: number): boolean {
    const index = this.services.findIndex(s => s.id === id);
    if (index !== -1) {
      this.services.splice(index, 1);
      return true;
    }
    return false;
  }
}

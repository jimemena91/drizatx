export class Service {
  id: number;
  name: string;
  prefix: string; // Ej: A, B, C
  priority: number; // 1 = alta prioridad
  estimatedTime: number; // en minutos
  active: boolean;
}

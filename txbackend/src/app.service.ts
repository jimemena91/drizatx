import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getMetrics() {
    return {
      waitTime: 8,
      queueLength: 24,
      activeCounters: 6,
      totalCounters: 8,
    };
  }
}

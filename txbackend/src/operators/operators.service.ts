import { Injectable } from '@nestjs/common';
import { Operator, Role } from './entities/operator.entity';

@Injectable()
export class OperatorsService {
  private operators: Operator[] = [];
  private currentId = 1;

  create(data: Omit<Operator, 'id'>): Operator {
    const operator: Operator = { id: this.currentId++, ...data };
    this.operators.push(operator);
    return operator;
  }

  findAll(): Operator[] {
    return this.operators;
  }

  findById(id: number): Operator | undefined {
    return this.operators.find(o => o.id === id);
  }

  update(id: number, data: Partial<Operator>): Operator | null {
    const operator = this.operators.find(o => o.id === id);
    if (operator) {
      Object.assign(operator, data);
      return operator;
    }
    return null;
  }
}

import { DataSource } from 'typeorm';
import { Settings } from './src/settings/entities/settings.entity';
import { Operator } from './src/operators/entities/operator.entity';
import { Service } from './src/services/entities/service.entity';
import { Ticket } from './src/tickets/entities/ticket.entity';
// Agregá otras entidades si las tenés

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root', // o el que uses
  password: 'jime1107',
  database: 'drizatx', // o el que corresponda
  entities: [Settings, Operator, Service, Ticket],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

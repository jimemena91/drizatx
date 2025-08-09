import { DataSource } from 'typeorm';
import { Settings } from './src/settings/settings.entity';
import { Operator } from './src/operators/operator.entity';
import { Service } from './src/services/service.entity';
import { Ticket } from './src/tickets/ticket.entity';

// Agregá todas tus entidades acá

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'drizatx',
  entities: [Settings, Operator, Service, Ticket],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

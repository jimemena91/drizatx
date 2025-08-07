export enum Role {
  OPERATOR = 'OPERATOR',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN'
}

export class Operator {
  id: number;
  name: string;
  email: string;
  position: string;
  role: Role;
  active: boolean;
  currentTicketId?: number;
}

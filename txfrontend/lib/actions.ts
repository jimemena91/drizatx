import { Ticket } from './types'

const BACKEND_URL = 'http://localhost:3001'; // Cambiar si usás otro puerto

export async function getTickets(): Promise<Ticket[]> {
  const res = await fetch(`${BACKEND_URL}/tickets`);
  if (!res.ok) throw new Error('Error al obtener los tickets');
  return res.json();
}

export async function createTicket(data: Partial<Ticket>): Promise<Ticket> {
  const res = await fetch(`${BACKEND_URL}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear ticket');
  return res.json();
}

export async function updateTicketStatus(id: number, status: string): Promise<Ticket> {
  const res = await fetch(`${BACKEND_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Error al actualizar estado del ticket');
  return res.json();
}

export async function GET() {
  try {
    const res = await fetch('http://localhost:3001/tickets'); // ✅ tu backend
    if (!res.ok) throw new Error('Error al obtener los tickets');
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('[GET /api/tickets]', error);
    return new Response('Error al obtener los tickets', { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch('http://localhost:3001/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Error al crear el ticket');
    const data = await res.json();
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error('[POST /api/tickets]', error);
    return new Response('Error al crear el ticket', { status: 500 });
  }
}
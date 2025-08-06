import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, operator_id } = await request.json()
    const id = parseInt(params.id)
    
    let updateFields = ['status = $1', 'updated_at = CURRENT_TIMESTAMP']
    let values = [status]
    let paramCount = 1
    
    if (operator_id) {
      paramCount++
      updateFields.push(`operator_id = $${paramCount}`)
      values.push(operator_id)
    }
    
    // Agregar timestamps según el estado
    if (status === 'called') {
      paramCount++
      updateFields.push(`called_at = $${paramCount}`)
      values.push(new Date())
    } else if (status === 'in_progress') {
      paramCount++
      updateFields.push(`started_at = $${paramCount}`)
      values.push(new Date())
    } else if (status === 'completed') {
      paramCount++
      updateFields.push(`completed_at = $${paramCount}`)
      values.push(new Date())
    }
    
    paramCount++
    values.push(id)
    
    const query = `
      UPDATE tickets 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `
    
    const updatedTicket = await sql.unsafe(query, values)
    
    if (!updatedTicket.length) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedTicket[0])
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}

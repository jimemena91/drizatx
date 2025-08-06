import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, prefix, priority, estimated_time, active } = await request.json()
    const id = parseInt(params.id)
    
    const updatedService = await sql`
      UPDATE services 
      SET name = ${name}, prefix = ${prefix}, priority = ${priority}, 
          estimated_time = ${estimated_time}, active = ${active},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    
    if (!updatedService.length) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedService[0])
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    await sql`DELETE FROM services WHERE id = ${id}`
    
    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}

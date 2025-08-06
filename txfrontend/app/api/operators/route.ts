import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/database'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const operators = await sql`
      SELECT id, name, email, position, role, active, created_at, updated_at
      FROM operators 
      ORDER BY name ASC
    `
    
    return NextResponse.json(operators)
  } catch (error) {
    console.error('Error fetching operators:', error)
    return NextResponse.json(
      { error: 'Failed to fetch operators' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, position, role = 'operator' } = await request.json()
    
    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10)
    
    const newOperator = await sql`
      INSERT INTO operators (name, email, password_hash, position, role)
      VALUES (${name}, ${email}, ${passwordHash}, ${position}, ${role})
      RETURNING id, name, email, position, role, active, created_at, updated_at
    `
    
    return NextResponse.json(newOperator[0], { status: 201 })
  } catch (error) {
    console.error('Error creating operator:', error)
    return NextResponse.json(
      { error: 'Failed to create operator' },
      { status: 500 }
    )
  }
}

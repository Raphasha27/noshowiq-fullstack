
import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockDb';

export async function GET() {
  const appointments = await mockDb.appointments.getAll();
  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newApp = await mockDb.appointments.add(body);
  return NextResponse.json(newApp);
}

export async function PATCH() {
  const updated = await mockDb.appointments.updateRisks();
  return NextResponse.json(updated);
}

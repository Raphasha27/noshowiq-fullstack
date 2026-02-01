
import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockDb';

export async function GET() {
  const patients = await mockDb.patients.getAll();
  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newPatient = await mockDb.patients.add(body);
  return NextResponse.json(newPatient);
}


import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockDb';

export async function GET() {
  const payments = await mockDb.payments.getAll();
  return NextResponse.json(payments);
}

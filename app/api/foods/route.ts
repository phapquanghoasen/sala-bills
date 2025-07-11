import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initAdmin } from '@/lib/firebase-admin-init';

initAdmin();
const db = getFirestore();

export async function GET() {
  try {
    const snapshot = await db.collection('foods').get();
    const foods = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(foods);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
  }
}
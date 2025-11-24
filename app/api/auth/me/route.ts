import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  
  if (!auth.success) {
    return auth.response;
  }

  return NextResponse.json(
    {
      success: true,
      user: auth.user,
    },
    { status: 200 }
  );
}

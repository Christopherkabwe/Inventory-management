import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRoleAction } from '@/lib/actions/auth/CheckAdminRole';

export async function POST(req: NextRequest) {
    const result = await checkAdminRoleAction();
    return NextResponse.json(result);
}
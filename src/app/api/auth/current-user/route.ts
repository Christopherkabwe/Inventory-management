// app/api/auth/current-user/route.ts
export const runtime = "nodejs";

import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    const user = await getCurrentUser();
    return Response.json({ user });
}

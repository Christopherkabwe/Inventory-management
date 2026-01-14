
import { getCurrentUser } from "@/lib/auth";

export async function checkAdminRoleAction() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
        return { error: "Unauthorized: only admins are allowed to perform this action" };
    }
    return { success: true };
}
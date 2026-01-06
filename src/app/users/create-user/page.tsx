// app/users/create-user/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/lib/rbac";
import CreateUserForm from "./CreateUserForm";

export default async function Page() {
    // 1️⃣ Get current user on the server
    const user = await getCurrentUser();

    // 2️⃣ Redirect if not ADMIN or MANAGER
    if (
        user.role !== UserRole.ADMIN &&
        user.role !== UserRole.MANAGER
    ) {
        redirect("/unauthorzed"); // or some "Access Denied" page
    }

    // 3️⃣ Render client form component
    return <CreateUserForm currentUser={user} />;
}

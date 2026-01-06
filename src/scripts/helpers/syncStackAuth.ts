// src/scripts/helpers/syncStackAuth.ts
import stackServerApp from "@stackframe/stack";

// StackUser type used in Prisma seeding
export interface StackUser {
    id: string;
    displayName: string | null;
    primaryEmail: string | null;
}

// SDK ServerUser type
interface ServerUser {
    id: string;
    displayName: string | null;
    primaryEmail: string | null;
}

// SDK paginated response
interface PaginatedUsers {
    users: ServerUser[];
    nextCursor: string | null;
}

/**
 * Fetch all StackAuth users with pagination
 */
export async function syncStackAuthUsers(): Promise<StackUser[]> {
    console.log("🔄 Syncing StackAuth users...");

    let allUsers: StackUser[] = [];
    let cursor: string | null = null;

    do {
        // Fetch a page of users
        const result: unknown = await stackServerApp.listUsers({ cursor });

        let usersPage: StackUser[] = [];

        // Type-guard: result is array
        if (Array.isArray(result)) {
            usersPage = result;
            cursor = null; // no pagination
        }
        // Type-guard: result has .users and .nextCursor
        else if (result && typeof result === "object" && "users" in result && "nextCursor" in result) {
            const paginated = result as PaginatedUsers;
            usersPage = paginated.users;
            cursor = paginated.nextCursor;
        } else {
            console.warn("⚠️ Unexpected StackAuth listUsers result:", result);
            break;
        }

        allUsers.push(...usersPage);
    } while (cursor); // continue until no next page

    if (allUsers.length === 0) {
        console.log("⚠️ No StackAuth users found.");
    } else {
        console.log(`✅ Found ${allUsers.length} StackAuth users.`);
    }

    return allUsers;
}

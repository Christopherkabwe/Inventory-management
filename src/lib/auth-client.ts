// lib/auth-client.ts
import useSWR from "swr";
import { UserRole } from "./rbac";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useCurrentUser() {
    const { data, error } = useSWR("/api/me", fetcher);

    if (error) throw error;
    if (!data) return null; // still loading

    if (data.error) throw new Error(data.error);

    return {
        id: data.id,
        email: data.email,
        role: data.role as UserRole,
        locationId: data.locationId,
        isActive: data.isActive,
    };
}

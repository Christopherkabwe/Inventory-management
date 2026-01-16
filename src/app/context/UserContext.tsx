"use client";

import { createContext, useContext, useEffect } from "react";

type User = {
    id: string;
    fullName: string;
    email: string;
    role: string;
    location?: {
        id: string;
        name: string;
    } | null;
};

const UserContext = createContext<User | null>(null);

export function UserProvider({
    user,
    loading = false,
    children,
}: {
    user: User | null;
    loading?: boolean;
    children: React.ReactNode;
}) {
    if (loading) return <div>Loading user...</div>;

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const user = useContext(UserContext);
    useEffect(() => {
        if (!user) {
            // Optional: you could redirect to /login instead of reloading
            window.location.reload();
        }
    }, [user]);
    return user;
}


export function useOptionalUser() {
    return useContext(UserContext);
}


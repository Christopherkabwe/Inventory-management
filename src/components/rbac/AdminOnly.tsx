"use client";

import { ReactNode } from "react";
import { useUser } from "@/app/context/UserContext";

export default function AdminOnly({ children }: { children: ReactNode }) {
    const user = useUser();

    if (user?.role !== "ADMIN") return null;

    return <>{children} </>;
}

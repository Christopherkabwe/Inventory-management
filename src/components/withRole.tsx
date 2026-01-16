"use client";

import { ComponentType } from "react";
import { useUser } from "@/app/context/UserContext";
import UnauthorizedAccess from "./UnauthorizedAccess";
import DashboardLayout from "./DashboardLayout";
import Loading from "./Loading";

interface WithRoleProps {
    [key: string]: unknown;
}

const withRole = (WrappedComponent: ComponentType<WithRoleProps>, allowedRoles: string[]) => {
    return (props: WithRoleProps) => {
        const user = useUser(); // ✅ get user from context

        // Optional: you can check for loading if your UserProvider adds a loading state
        if (!user) {
            return (
                <DashboardLayout>
                    <div className="min-h-screen flex items-center justify-center">
                        <Loading message="Loading ..." />
                    </div>
                </DashboardLayout>
            );
        }

        // Check if user role is allowed
        const authorized = allowedRoles.includes(user.role);

        if (!authorized) {
            return <UnauthorizedAccess />;
        }

        // User is authorized → render wrapped component
        return <WrappedComponent {...props} />;
    };
};

export default withRole;

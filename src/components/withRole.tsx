"use client";

import { ComponentType, ReactNode } from "react";
import { useUser } from "@/app/context/UserContext";
import UnauthorizedAccess from "./UnauthorizedAccess";
import DashboardLayout from "./DashboardLayout";
import Loading from "./Loading";

interface WithRoleProps {
    children?: ReactNode;
    [key: string]: any;
}

/**
 * Higher-order component for role-based access control.
 * @param WrappedComponent The component/page to wrap.
 * @param allowedRoles Array of allowed roles.
 */
const withRole = <P extends object>(
    WrappedComponent: ComponentType<P>,
    allowedRoles: string[]
) => {
    const ComponentWithRole = (props: P) => {
        const user = useUser();

        // Loading user context
        if (!user) {
            return (
                <DashboardLayout>
                    <div className="min-h-screen flex items-center justify-center">
                        <Loading message="Loading user..." />
                    </div>
                </DashboardLayout>
            );
        }

        // Unauthorized
        if (!allowedRoles.includes(user.role)) {
            return <UnauthorizedAccess />;
        }

        // Authorized
        return <WrappedComponent {...props} />;
    };

    return ComponentWithRole;
};

export default withRole;

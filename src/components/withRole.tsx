// components/withRole.tsx
import { useEffect, useState } from 'react';
import UnauthorizedAccess from './UnauthorizedAccess';
import DashboardLayout from './DashboardLayout';
import Loading from './Loading';
import { ComponentType } from 'react';

interface WithRoleProps {
    [key: string]: unknown;
}

let userCache = null;
let userCachePromise = null;

const withRole = (WrappedComponent: ComponentType<WithRoleProps>, allowedRoles: string[]) => {
    return (props: WithRoleProps) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);
        const [authorized, setAuthorized] = useState(false);

        useEffect(() => {
            const fetchUser = async () => {
                if (userCache) {
                    setUser(userCache);
                    setAuthorized(allowedRoles.includes(userCache.role));
                    setLoading(false);
                    return;
                }

                if (userCachePromise) {
                    try {
                        const data = await userCachePromise;
                        if (data && data.success) {
                            userCache = data.user;
                            setUser(userCache);
                            setAuthorized(allowedRoles.includes(userCache.role));
                        } else if (data?.error) {
                            console.error(data.error);
                        }
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setLoading(false);
                    }
                    return;
                }

                userCachePromise = fetch('/api/users/me')
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.success) {
                            userCache = data.user;
                            setUser(userCache);
                            setAuthorized(allowedRoles.includes(userCache.role));
                        } else if (data?.error) {
                            console.error(data.error);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            };

            fetchUser();
        }, []);

        if (loading) {
            return (
                <DashboardLayout>
                    <div className="min-h-screen rounded-lg border border-gray-500 bg-white flex items-center justify-center">
                        <Loading message="Loading ..." />
                    </div>
                </DashboardLayout>
            );
        }

        if (!authorized) {
            return <UnauthorizedAccess />;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withRole;
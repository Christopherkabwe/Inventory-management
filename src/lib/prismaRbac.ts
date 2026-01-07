// lib/prismaRbac.ts
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/rbac";
import { NextApiRequest } from "next";

type ModelName = keyof typeof prisma;

interface FetchOptions {
    where?: any;
    include?: any;
    orderBy?: any;
    take?: number;
    skip?: number;
}

interface CurrentUser {
    id: string;
    role: UserRole;
    locationId?: string;
}

/**
 * Detect ownership fields dynamically
 */
function detectOwnershipFields(model: ModelName) {
    // @ts-ignore
    const meta = prisma[model]?._dmmf?.modelMap?.[model];
    const fields = meta?.fields?.map((f: any) => f.name) || [];

    const hasOwner = fields.includes("createdById");
    const hasLocation = fields.includes("locationId");

    return { hasOwner, hasLocation };
}

/**
 * Build RBAC filter
 */
function buildRbacFilter(model: ModelName, user: CurrentUser) {
    const { id, role, locationId } = user;

    if (role === UserRole.ADMIN) return {};

    const { hasOwner, hasLocation } = detectOwnershipFields(model);

    if (hasOwner && hasLocation) {
        return { OR: [{ createdById: id }, { locationId: locationId ?? undefined }] };
    } else if (hasOwner) {
        return { createdById: id };
    } else if (hasLocation) {
        return { locationId: locationId ?? undefined };
    }

    return { id: null }; // restrict access if neither field exists
}

/**
 * Extract user from request headers/session for demo purposes
 */
function getUserFromReq(req: NextApiRequest): CurrentUser {
    // Example: pass headers `x-user-id`, `x-user-role`, `x-location-id`
    return {
        id: req.headers["x-user-id"] as string,
        role: req.headers["x-user-role"] as UserRole,
        locationId: req.headers["x-location-id"] as string,
    };
}

export const rbac = {
    fetch: async (model: ModelName, req: NextApiRequest, options: FetchOptions = {}) => {
        const user = getUserFromReq(req);
        const rbacFilter = buildRbacFilter(model, user);
        const finalWhere = { ...options.where, ...rbacFilter };

        // @ts-ignore
        return prisma[model].findMany({ ...options, where: finalWhere });
    },

    fetchOne: async (model: ModelName, req: NextApiRequest, identifier: any, options: FetchOptions = {}) => {
        const user = getUserFromReq(req);
        const rbacFilter = buildRbacFilter(model, user);
        const finalWhere = { ...identifier, ...rbacFilter };

        // @ts-ignore
        return prisma[model].findFirst({ ...options, where: finalWhere });
    },

    findUnique: async (model: ModelName, req: NextApiRequest, uniqueField: any, options: FetchOptions = {}) => {
        const user = getUserFromReq(req);
        const rbacFilter = buildRbacFilter(model, user);
        const finalWhere = { ...uniqueField, ...rbacFilter };

        // @ts-ignore
        return prisma[model].findFirst({ ...options, where: finalWhere });
    },
};

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

type ModelName = keyof typeof prisma;

interface FetchOptions {
    where?: any;
    include?: any;
    orderBy?: any;
    take?: number;
    skip?: number;
}

/**
 * Dynamically detect ownership fields from Prisma model metadata
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
 * Build RBAC filter dynamically
 */
function buildRbacFilter(
    model: ModelName,
    currentUser: { id: string; role: UserRole; locationId?: string }
) {
    const { id, role, locationId } = currentUser;

    if (role === UserRole.ADMIN) return {};

    const { hasOwner, hasLocation } = detectOwnershipFields(model);

    if (hasOwner && hasLocation) {
        return {
            OR: [{ createdById: id }, { locationId: locationId ?? undefined }],
        };
    } else if (hasOwner) {
        return { createdById: id };
    } else if (hasLocation) {
        return { locationId: locationId ?? undefined };
    }

    // Model has neither ownership nor location → restrict completely
    return { id: null }; // ensures no results for regular user
}

/**
 * Global RBAC bulk fetch
 */
export async function rbacFetch(
    model: ModelName,
    currentUser: { id: string; role: UserRole; locationId?: string },
    options: FetchOptions = {}
) {
    const { where = {}, include, orderBy, take, skip } = options;
    const rbacFilter = buildRbacFilter(model, currentUser);

    const finalWhere = { ...where, ...rbacFilter };

    // @ts-ignore
    return prisma[model].findMany({
        where: finalWhere,
        include,
        orderBy,
        take,
        skip,
    });
}

/**
 * Global RBAC single item fetch
 */
export async function rbacFetchOne(
    model: ModelName,
    currentUser: { id: string; role: UserRole; locationId?: string },
    identifier: any, // { id: string } or other unique key
    options: FetchOptions = {}
) {
    const { include } = options;
    const rbacFilter = buildRbacFilter(model, currentUser);

    const finalWhere = { ...identifier, ...rbacFilter };

    // @ts-ignore
    return prisma[model].findFirst({
        where: finalWhere,
        include,
    });
}

/**
 * Global RBAC find unique
 */
export async function rbacFindUnique(
    model: ModelName,
    currentUser: { id: string; role: UserRole; locationId?: string },
    uniqueField: any, // { id: "..." } or any unique key
    options: FetchOptions = {}
) {
    const { include } = options;
    const rbacFilter = buildRbacFilter(model, currentUser);

    const finalWhere = { ...uniqueField, ...rbacFilter };

    // @ts-ignore
    return prisma[model].findFirst({
        where: finalWhere,
        include,
    });
}

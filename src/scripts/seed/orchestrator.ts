import { seedCore } from "./seedCore ";
import { seedOperations } from "./seedOperations ";
import { seedWorkflows } from "./seedWorkflows ";
import { seedAnalytics } from "./seedAnalytics "
import { prisma } from "@/lib/prisma";
import { ClearDatabase } from "../ClearDatabase";

async function main() {
    await ClearDatabase();
    try {
        await seedCore();
        await seedOperations();
        await seedWorkflows();
        await seedAnalytics();
        console.log("✅ FULL DATABASE SEED COMPLETED SUCCESSFULLY");
    } catch (e) {
        console.error("❌ Seed failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

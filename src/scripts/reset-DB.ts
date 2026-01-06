import { prisma } from "../lib/prisma"; // adjust path to your prisma client

async function resetDatabase() {
    try {
        console.log("Dropping all tables...");
        await prisma.$executeRaw`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`;
        console.log("Database reset complete!");
    } catch (err) {
        console.error("Failed to reset database:", err);
    } finally {
        await prisma.$disconnect();
    }
}

resetDatabase();

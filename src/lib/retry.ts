import { Prisma } from "@/generated/prisma";

export default async function withRetries<T>(
    fn: () => Promise<T>,
    retries = 3,
    delayMs = 500
): Promise<T> {
    let attempt = 0;

    while (true) {
        try {
            return await fn();
        } catch (err: unknown) {
            attempt++;
            if (attempt > retries) throw err;

            console.warn(`Retrying due to error. Attempt ${attempt}/${retries}`, err);
            await new Promise((res) => setTimeout(res, delayMs));
        }
    }
}
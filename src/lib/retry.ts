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

            // Only retry known Prisma request errors
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                const code = err.code;

                if (code === "P2034" || code === "P2002") {
                    if (attempt > retries) throw err;

                    console.warn(
                        `Prisma retryable error (${code}). Attempt ${attempt}/${retries}. Retrying in ${delayMs}ms...`
                    );

                    await new Promise((res) => setTimeout(res, delayMs));
                    continue;
                }
            }

            // ❌ Not retryable → bubble up immediately
            throw err;
        }
    }
}

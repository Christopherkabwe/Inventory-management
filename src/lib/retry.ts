export default async function withRetries<T>(
    fn: () => Promise<T>,
    retries = 3,
    delayMs = 500
): Promise<T> {
    let attempt = 0;
    while (true) {
        try {
            return await fn();
        } catch (err) {
            attempt++;
            if (attempt > retries) throw err;
            console.warn(`Attempt ${attempt} failed. Retrying in ${delayMs}ms...`, err);
            await new Promise((res) => setTimeout(res, delayMs));
        }
    }
}

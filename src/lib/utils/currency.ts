export type CurrencyCode = "ZMW" | "USD" | "EUR" | "GBP";

const SYMBOL_TO_CURRENCY: Record<string, CurrencyCode> = {
    K: "ZMW",
    $: "USD",
    //€: "EUR",
    //£: "GBP",
};

export function detectCurrency({
    currency,
    symbol,
    locale,
}: {
    currency?: string;
    symbol?: string;
    locale?: string;
}): CurrencyCode {
    if (currency) return currency as CurrencyCode;

    if (symbol && SYMBOL_TO_CURRENCY[symbol]) {
        return SYMBOL_TO_CURRENCY[symbol];
    }

    if (locale?.startsWith("en-ZM")) return "ZMW";

    return "USD";
}

export function formatCurrency(
    value: number,
    currency: CurrencyCode,
    locale = "en-US"
) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

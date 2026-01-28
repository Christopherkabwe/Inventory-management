import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(
  value: number | undefined | null,
  decimals: number = 2
): string {
  if (value === null || value === undefined) return "0.00"

  return value.toLocaleString("en-ZM", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

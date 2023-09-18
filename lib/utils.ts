import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const formattedPrice = (price: number) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(price);
}

export const percentageValues = Array.from({ length: 10 }).map((_, index) => Number(((index + 1) * 0.1).toFixed(1).replace(/\.0$/, "")))
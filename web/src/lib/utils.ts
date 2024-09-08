import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SpellsCIDArray, SpellsNameArr } from "./constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatHash(hash: string) {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function urlJoin(...parts: string[]) {
    return parts.map((part) => part.replace(/\/$/, "")).join("/");
}

export function URItoSpellName(URI: string) {
    const index = SpellsCIDArray.indexOf(URI);
    return SpellsNameArr[index];
}

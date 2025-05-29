import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToAscii = (inputStr: string) => {
  // Matches only printable ASCII characters.
  const asciiPrintableString = inputStr.replace(/[^\x20-\x7E]+/g, "");
  return asciiPrintableString;
};

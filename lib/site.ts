export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://silverpineapple.net").replace(/\/+$/, "");

export function toAbsoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

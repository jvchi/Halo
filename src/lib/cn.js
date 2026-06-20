// Tiny className joiner — filters falsy values so conditional classes stay readable.
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

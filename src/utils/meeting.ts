export function generateMeetingPin(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}

export function isValidMeetingName(meetingName: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(meetingName);
}

export function parseMeetingPinFromPath(pathname: string): string {
  let path = pathname;
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  if (path.startsWith("/")) {
    path = path.slice(1);
  }
  return path;
}

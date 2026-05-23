import { describe, it, expect } from "vitest";
import {
  generateMeetingPin,
  isValidMeetingName,
  parseMeetingPinFromPath,
} from "./meeting";

describe("generateMeetingPin", () => {
  it("returns a 10-character string", () => {
    const pin = generateMeetingPin();
    expect(pin).toHaveLength(10);
  });

  it("only contains lowercase alphanumeric characters", () => {
    const pin = generateMeetingPin();
    expect(pin).toMatch(/^[a-z0-9]+$/);
  });

  it("generates different pins on successive calls", () => {
    const pins = new Set(Array.from({ length: 10 }, () => generateMeetingPin()));
    expect(pins.size).toBeGreaterThan(1);
  });
});

describe("isValidMeetingName", () => {
  it("accepts alphanumeric strings", () => {
    expect(isValidMeetingName("abc123")).toBe(true);
  });

  it("accepts underscores and dashes", () => {
    expect(isValidMeetingName("my-meeting_1")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidMeetingName("")).toBe(false);
  });

  it("rejects strings with spaces", () => {
    expect(isValidMeetingName("my meeting")).toBe(false);
  });

  it("rejects strings with special characters", () => {
    expect(isValidMeetingName("meeting!@#")).toBe(false);
  });

  it("rejects strings with slashes", () => {
    expect(isValidMeetingName("path/to/meeting")).toBe(false);
  });
});

describe("parseMeetingPinFromPath", () => {
  it("strips leading slash", () => {
    expect(parseMeetingPinFromPath("/abc123")).toBe("abc123");
  });

  it("strips trailing slash", () => {
    expect(parseMeetingPinFromPath("abc123/")).toBe("abc123");
  });

  it("strips both leading and trailing slashes", () => {
    expect(parseMeetingPinFromPath("/abc123/")).toBe("abc123");
  });

  it("returns empty string for root path", () => {
    expect(parseMeetingPinFromPath("/")).toBe("");
  });

  it("returns the pin as-is when no slashes", () => {
    expect(parseMeetingPinFromPath("abc123")).toBe("abc123");
  });
});

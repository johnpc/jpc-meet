import { describe, it, expect } from "vitest";
import { generateAttendeeName } from "./attendee";

describe("generateAttendeeName", () => {
  it("returns a name with format 'Adjective Animal'", () => {
    const name = generateAttendeeName();
    expect(name).toMatch(/^\w+ \w+$/);
  });

  it("uses the injected random function", () => {
    // randomFn returning 0 should pick first adjective and first animal
    const name = generateAttendeeName(() => 0);
    expect(name).toBe("Playful Cat");
  });

  it("picks last items when randomFn returns 0.99", () => {
    const name = generateAttendeeName(() => 0.99);
    expect(name).toBe("Loyal Penguin");
  });

  it("generates different names with default randomFn", () => {
    const names = new Set(
      Array.from({ length: 20 }, () => generateAttendeeName()),
    );
    expect(names.size).toBeGreaterThan(1);
  });
});

import { describe, expect, it } from "vitest";

// Simple test suite
describe("Basic Vitest Test", () => {
  // Test case 1: Basic addition
  it("should correctly add two numbers", () => {
    expect(1 + 1).toBe(2);
  });

  // Test case 2: String check
  it("should correctly check string equality", () => {
    expect("hello").toBe("hello");
  });

  // Test case 3: Array check
  it("should verify array contents", () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(2);
  });
});

describe("Basic Vitest Test 2", () => {
  // Test case 1: Basic addition
  it("should correctly add two numbers", () => {
    expect(1 + 1).toBe(2);
  });

  // Test case 2: String check
  it("should correctly check string equality", () => {
    expect("hello").toBe("hello");
  });

  // Test case 3: Array check
  it("should verify array contents", () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(2);
  });
});

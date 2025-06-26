import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("Input Tests", () => {
  it('should render input with placeholder "Neue Kategorie..."', () => {
    // Render the component
    render(<App />);

    // Find button by text
    const input = screen.getByPlaceholderText("Neue Kategorie...");
    // Assert button exists and has correct text
    expect(input).toBeDefined();

    expect(input.placeholder).toBe("Neue Kategorie...");
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("Button Tests", () => {
  it('should render button with text "Kategorie hinzufügen"', () => {
    // Render the component
    render(<App />);

    // Find button by text
    const button = screen.getByRole("button", {
      name: /kategorie hinzufügen/i,
    });

    // Assert button exists and has correct text
    expect(button).toBeDefined();
    expect(button.textContent).toBe("Kategorie hinzufügen");
  });
});

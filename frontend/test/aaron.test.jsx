import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("Button Tests", () => {
  it('should render button with text "Kategorie hinzufügen"', () => {
    // Render the component
    render(<App />);

    // Find button by text
    const categoryInput = screen.getByPlaceholderText("Neue Kategorie...");

    expect(categoryInput).toBeDefined();
  });
});

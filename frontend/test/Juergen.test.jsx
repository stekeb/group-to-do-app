import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("Input Field Tests", () => {
  it('should render an input field with placeholder "Neue Kategorie..."', () => {
    // Render the component
    render(<App />);

    // Find input field by placeholder text
    const inputField = screen.getByPlaceholderText("Neue Kategorie...");

    // Assert input field exists
    expect(inputField).toBeDefined();
  });
});

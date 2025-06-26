import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/App";

describe("Eingabefeld Validierung", () => {
  it('sollte ein Input-Feld mit dem Platzhalter "Neue Kategorie..." anzeigen', () => {
    // Arrange
    render(<App />);

    // Act
    const inputElement = screen.getByPlaceholderText("Neue Kategorie...");

    // Assert
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("placeholder", "Neue Kategorie...");
  });
});

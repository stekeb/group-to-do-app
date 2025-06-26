import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/App";

describe("App Komponente", () => {
  test('stellt das Eingabefeld für die neue Kategorie, welches den Platzhalter "Neue Kategorie..." enthält, dar.', () => {
    render(<App />);
    const newCategoryInput = screen.getByPlaceholderText("Neue Kategorie...");
    expect(newCategoryInput).toBeInTheDocument();
  });
});

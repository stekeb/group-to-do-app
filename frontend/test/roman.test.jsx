import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../src/App";
import "@testing-library/jest-dom";
import React from "react";

describe("Prüft die Anwesentheit des Eingabefelds", () => {
  it("zeigt das Eingabefeld mit dem Platzhalter 'Neue Kategorie...'", () => {
    render(<App />);

    // Suche das Eingabefeld mit dem spezifischen Platzhalter
    const inputField = screen.getByPlaceholderText("Neue Kategorie...");
    expect(inputField).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import App from "../src/App"; // Passe den Pfad zu deiner App-Komponente an

test('zeigt ein Eingabefeld mit dem Placeholder "Neue Kategorie..."', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText("Neue Kategorie...");
  expect(inputElement).toBeInTheDocument();
});

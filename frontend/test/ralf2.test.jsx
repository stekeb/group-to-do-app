import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import App from "../src/App";

test("erstellt eine neue Kategorie", async () => {
  render(<App />);

  // Finde das Eingabefeld und den Button
  const inputElement = screen.getByPlaceholderText("Neue Kategorie...");
  const buttonElement = screen.getByRole("button", {
    name: /Kategorie hinzufügen/i,
  });

  // Simuliere die Eingabe einer neuen Kategorie
  fireEvent.change(inputElement, { target: { value: "Meine neue Kategorie" } });

  // Simuliere einen Klick auf den Button
  fireEvent.click(buttonElement);

  // Überprüfe, ob die neue Kategorie in der Kategorie-Liste erscheint
  const newCategoryButton = await screen.findByRole("button", {
    name: "Meine neue Kategorie (0/0)",
  });
  expect(newCategoryButton).toBeInTheDocument();
});

test("Kategorie kann mit dem Löschbutton gelöscht werden", () => {
  render(<App />);
  const buttonDeleteElement = screen.getByText("🗑️");
  fireEvent.click(buttonDeleteElement);
  expect(buttonDeleteElement).not.toBeInTheDocument();
});

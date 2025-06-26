import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App"; // Importiere deine Hauptkomponente

describe("App-Komponente Tests", () => {
  test('Überprüft das Eingabefeld mit dem Platzhalter "Neue Kategorie..."', () => {
    render(<App />);
    const inputField = screen.getByPlaceholderText("Neue Kategorie...");
    expect(inputField).toBeInTheDocument(); // Prüft, ob das Eingabefeld existiert
  });

  test("Überprüft die Darkmode-Button-Funktionalität", () => {
    render(<App />);
    const darkModeButton = screen.getByRole("button", { name: "🌙" }); // Sucht nach dem Button für Darkmode (Startzustand)

    // Simuliert einen Button-Klick für Darkmode
    userEvent.click(darkModeButton);

    // Erwartet, dass der Body die Darkmode-Klasse enthält
    expect(document.body.className).toBe("dark-mode");

    // Simuliert einen erneuten Button-Klick für Lichtmodus
    userEvent.click(darkModeButton);

    // Erwartet, dass die Klasse wieder entfernt wird
    expect(document.body.className).toBe("");
  });
});

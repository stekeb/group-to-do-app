import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

function Einfuegen() {
  return <input placeholder="Neue Kategorie..." />;
}

test("Überprüfung ob Eingabefeld bestätigt", () => {
  render(<Einfuegen />);
  const inputElement = screen.getByPlaceholderText("Neue Kategorie...");
  expect(inputElement).toBeInTheDocument();
});

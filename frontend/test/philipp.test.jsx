import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/App";

describe("Input Field Tests", () => {
  it('should render input field with placeholder "Neue Kategorie..."', () => {
    render(<App />);

    const inputField = screen.getByPlaceholderText("Neue Kategorie...");

    expect(inputField).toBeInTheDocument();
    expect(inputField).toHaveAttribute("placeholder", "Neue Kategorie...");
  });
});

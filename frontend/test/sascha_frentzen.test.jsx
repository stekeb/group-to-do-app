import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import React from "react";
import App from "../src/App";

describe("Input Field Tests", () => {
  it('should render input field with placeholder "Neue Kategorie..."', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText("Neue Kategorie...");
    expect(inputElement).toBeInTheDocument();
  });

  it("should ensure the input field is of type text", () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText("Neue Kategorie...");
    expect(inputElement).toHaveAttribute("type", "text");
  });

  it("should ensure the input field is initially empty", () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText("Neue Kategorie...");
    expect(inputElement.value).toBe("");
  });
});

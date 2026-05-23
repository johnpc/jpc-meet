import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";

vi.mock("@aws-amplify/ui-react", () => ({
  Card: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <div onClick={onClick}>{children}</div>,
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Heading: ({ children }: { children: React.ReactNode }) => (
    <h5>{children}</h5>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Grid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Image: ({ alt }: { alt: string }) => <img alt={alt} />,
  Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({
    tokens: { space: { small: "0.25rem" }, radii: { large: "8px" } },
  }),
}));

describe("Header", () => {
  it("renders the app name", () => {
    render(<Header />);
    expect(screen.getByText("meet.jpc.io")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Header />);
    expect(
      screen.getByText("Zero-auth video conferencing"),
    ).toBeInTheDocument();
  });

  it("navigates home on click", () => {
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...originalLocation, href: "/some-meeting" },
    });

    render(<Header />);
    fireEvent.click(screen.getByText("meet.jpc.io"));
    expect(window.location.href).toBe("/");

    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });
});

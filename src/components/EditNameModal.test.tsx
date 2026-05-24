import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditNameModal } from "./EditNameModal";

describe("EditNameModal", () => {
  it("does not render when isOpen is false", () => {
    render(
      <EditNameModal
        currentName="Alice"
        isOpen={false}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders input with current name when open", () => {
    render(
      <EditNameModal
        currentName="Alice"
        isOpen={true}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    const input = screen.getByLabelText("Display Name") as HTMLInputElement;
    expect(input.value).toBe("Alice");
  });

  it("calls onSave with trimmed name on Save click", () => {
    const onSave = vi.fn();
    render(
      <EditNameModal
        currentName="Alice"
        isOpen={true}
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );
    const input = screen.getByLabelText("Display Name");
    fireEvent.change(input, { target: { value: "  Bob  " } });
    fireEvent.click(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalledWith("Bob");
  });

  it("calls onCancel when Cancel is clicked", () => {
    const onCancel = vi.fn();
    render(
      <EditNameModal
        currentName="Alice"
        isOpen={true}
        onSave={vi.fn()}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("shows error when saving empty name", () => {
    const onSave = vi.fn();
    render(
      <EditNameModal
        currentName="Alice"
        isOpen={true}
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );
    const input = screen.getByLabelText("Display Name");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Name cannot be empty.",
    );
    expect(onSave).not.toHaveBeenCalled();
  });

  it("clears error when user types after validation failure", () => {
    render(
      <EditNameModal
        currentName="Alice"
        isOpen={true}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    const input = screen.getByLabelText("Display Name");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "New" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

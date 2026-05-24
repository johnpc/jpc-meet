import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditNameButton } from "./EditNameButton";

vi.mock("amazon-chime-sdk-component-library-react", () => ({
  ControlBarButton: ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => <button onClick={onClick}>{label}</button>,
  Attendees: () => <span>AttendeesIcon</span>,
}));

describe("EditNameButton", () => {
  it("renders with the attendee name as label", () => {
    render(<EditNameButton attendeeName="Alice" onNameChange={vi.fn()} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("truncates long names", () => {
    render(
      <EditNameButton attendeeName="VeryLongNameHere" onNameChange={vi.fn()} />,
    );
    expect(screen.getByText("VeryLongNa...")).toBeInTheDocument();
  });

  it("opens the modal on click", () => {
    render(<EditNameButton attendeeName="Alice" onNameChange={vi.fn()} />);
    fireEvent.click(screen.getByText("Alice"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onNameChange and closes modal on save", () => {
    const onNameChange = vi.fn();
    render(
      <EditNameButton attendeeName="Alice" onNameChange={onNameChange} />,
    );
    fireEvent.click(screen.getByText("Alice"));
    const input = screen.getByLabelText("Display Name");
    fireEvent.change(input, { target: { value: "Bob" } });
    fireEvent.click(screen.getByText("Save"));
    expect(onNameChange).toHaveBeenCalledWith("Bob");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes modal on cancel without calling onNameChange", () => {
    const onNameChange = vi.fn();
    render(
      <EditNameButton attendeeName="Alice" onNameChange={onNameChange} />,
    );
    fireEvent.click(screen.getByText("Alice"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(onNameChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

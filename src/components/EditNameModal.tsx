import { useEffect, useRef, useState } from "react";

export interface EditNameModalProps {
  currentName: string;
  isOpen: boolean;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export const EditNameModal = ({
  currentName,
  isOpen,
  onSave,
  onCancel,
}: EditNameModalProps) => {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, currentName]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name cannot be empty.");
      return;
    }
    if (trimmed.length > 64) {
      setError("Name must be 64 characters or fewer.");
      return;
    }
    setError("");
    onSave(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="edit-name-overlay" onClick={onCancel}>
      <div
        className="edit-name-modal"
        role="dialog"
        aria-label="Edit display name"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="edit-name-title">Edit Display Name</h3>
        <p className="edit-name-description">
          Your name will be updated for all participants in this meeting.
        </p>
        <label htmlFor="edit-name-input" className="edit-name-label">
          Display Name
        </label>
        <input
          ref={inputRef}
          id="edit-name-input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          className="edit-name-input"
          maxLength={64}
        />
        {error && (
          <span className="edit-name-error" role="alert">
            {error}
          </span>
        )}
        <div className="edit-name-actions">
          <button className="edit-name-btn edit-name-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="edit-name-btn edit-name-btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";

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

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name cannot be empty.");
      return;
    }
    setError("");
    onSave(trimmed);
  };

  return (
    <div className="edit-name-modal" role="dialog" aria-label="Edit name">
      <label htmlFor="edit-name-input">Display Name</label>
      <input
        id="edit-name-input"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError("");
        }}
      />
      {error && (
        <span className="edit-name-error" role="alert">
          {error}
        </span>
      )}
      <div className="edit-name-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

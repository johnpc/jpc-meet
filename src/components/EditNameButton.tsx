import { useState } from "react";
import {
  ControlBarButton,
  Attendees,
} from "amazon-chime-sdk-component-library-react";
import { EditNameModal } from "./EditNameModal";

export interface EditNameButtonProps {
  attendeeName: string;
  onNameChange: (newName: string) => void;
}

export const EditNameButton = ({
  attendeeName,
  onNameChange,
}: EditNameButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const label =
    attendeeName.length > 10 ? attendeeName.slice(0, 10) + "..." : attendeeName;

  const handleSave = (newName: string) => {
    onNameChange(newName);
    setIsOpen(false);
  };

  return (
    <>
      <ControlBarButton
        icon={<Attendees />}
        onClick={() => setIsOpen(true)}
        label={label}
      />
      <EditNameModal
        currentName={attendeeName}
        isOpen={isOpen}
        onSave={handleSave}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
};

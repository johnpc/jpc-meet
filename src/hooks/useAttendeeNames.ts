import { useCallback, useEffect, useRef, useState } from "react";
import {
  useAudioVideo,
  useMeetingManager,
} from "amazon-chime-sdk-component-library-react";
import { DataMessage } from "amazon-chime-sdk-js";

interface NameChangePayload {
  attendeeId: string;
  newName: string;
}

const NAME_CHANGE_TOPIC = "attendee-name-change";
const MESSAGE_LIFETIME_MS = 300000;

export function useAttendeeNames(localAttendeeName: string) {
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();
  const [nameOverrides, setNameOverrides] = useState<Record<string, string>>(
    {},
  );
  const localNameRef = useRef(localAttendeeName);

  useEffect(() => {
    localNameRef.current = localAttendeeName;
  }, [localAttendeeName]);

  const handleNameChange = useCallback((dataMessage: DataMessage) => {
    const text = new TextDecoder().decode(dataMessage.data);
    let payload: NameChangePayload;
    try {
      payload = JSON.parse(text);
    } catch {
      return;
    }
    setNameOverrides((prev) => ({
      ...prev,
      [payload.attendeeId]: payload.newName,
    }));
  }, []);

  useEffect(() => {
    if (!audioVideo) return;

    audioVideo.realtimeSubscribeToReceiveDataMessage(
      NAME_CHANGE_TOPIC,
      handleNameChange,
    );

    return () => {
      audioVideo.realtimeUnsubscribeFromReceiveDataMessage(NAME_CHANGE_TOPIC);
    };
  }, [audioVideo, handleNameChange]);

  const broadcastNameChange = useCallback(
    (newName: string) => {
      if (!audioVideo) return;

      const config = meetingManager.meetingSessionConfiguration;
      const attendeeId = config?.credentials?.attendeeId ?? "";
      const payload: NameChangePayload = { attendeeId, newName };

      audioVideo.realtimeSendDataMessage(
        NAME_CHANGE_TOPIC,
        JSON.stringify(payload),
        MESSAGE_LIFETIME_MS,
      );

      setNameOverrides((prev) => ({
        ...prev,
        [attendeeId]: newName,
      }));
    },
    [audioVideo, meetingManager],
  );

  const resolveAttendeeName = useCallback(
    (chimeAttendeeId: string, externalUserId?: string): string => {
      if (nameOverrides[chimeAttendeeId]) {
        return nameOverrides[chimeAttendeeId];
      }
      return externalUserId?.split("#")[0] || "Unknown";
    },
    [nameOverrides],
  );

  return { nameOverrides, broadcastNameChange, resolveAttendeeName };
}

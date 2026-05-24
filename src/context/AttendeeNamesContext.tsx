import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  useAudioVideo,
  useMeetingManager,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import { DataMessage } from "amazon-chime-sdk-js";

interface NameChangePayload {
  attendeeId: string;
  newName: string;
}

interface AttendeeNamesContextValue {
  getAttendeeName: (chimeAttendeeId: string) => string;
  broadcastNameChange: (newName: string) => void;
}

const AttendeeNamesContext = createContext<AttendeeNamesContextValue | null>(
  null,
);

const NAME_CHANGE_TOPIC = "attendee-name-change";
const MESSAGE_LIFETIME_MS = 300000;

export function AttendeeNamesProvider({ children }: { children: ReactNode }) {
  const audioVideo = useAudioVideo();
  const meetingManager = useMeetingManager();
  const { roster } = useRosterState();
  const [nameOverrides, setNameOverrides] = useState<Record<string, string>>(
    {},
  );
  const nameOverridesRef = useRef(nameOverrides);

  useEffect(() => {
    nameOverridesRef.current = nameOverrides;
  }, [nameOverrides]);

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
      if (!attendeeId) return;

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

  const getAttendeeName = useCallback(
    (chimeAttendeeId: string): string => {
      if (nameOverrides[chimeAttendeeId]) {
        return nameOverrides[chimeAttendeeId];
      }
      const rosterEntry = roster[chimeAttendeeId];
      if (rosterEntry?.name) {
        return rosterEntry.name;
      }
      const externalUserId = rosterEntry?.externalUserId;
      return externalUserId?.split("#")[0] || "Unknown";
    },
    [nameOverrides, roster],
  );

  return (
    <AttendeeNamesContext.Provider value={{ getAttendeeName, broadcastNameChange }}>
      {children}
    </AttendeeNamesContext.Provider>
  );
}

export function useAttendeeNamesContext() {
  const ctx = useContext(AttendeeNamesContext);
  if (!ctx) {
    throw new Error(
      "useAttendeeNamesContext must be used within AttendeeNamesProvider",
    );
  }
  return ctx;
}

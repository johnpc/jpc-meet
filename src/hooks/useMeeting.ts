import { useCallback, useEffect, useRef, useState } from "react";
import {
  useMeetingManager,
  DeviceLabels,
} from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import {
  generateMeetingPin,
  isValidMeetingName,
  parseMeetingPinFromPath,
} from "../utils/meeting";
import { generateAttendeeName } from "../utils/attendee";

export type LoadingAction = "start" | "join" | "auto" | null;

const client = generateClient<Schema>();

export interface MeetingApi {
  getMeetingMetadata: (
    meetingName: string,
    attendeeName: string,
  ) => Promise<{ data: Record<string, string> | null }>;
}

export interface MeetingManagerApi {
  join: (
    config: MeetingSessionConfiguration,
    options: { deviceLabels: DeviceLabels },
  ) => Promise<void>;
  start: () => Promise<void>;
  invokeDeviceProvider: (labels: DeviceLabels) => void;
}

export function buildMeetingSessionConfig(
  meetingFields: Record<string, string>,
): MeetingSessionConfiguration {
  return new MeetingSessionConfiguration(
    {
      ...meetingFields,
      mediaPlacement: {
        ...meetingFields,
        audioFallbackUrl: meetingFields.audioFallbackUrl,
        audioHostUrl: meetingFields.audioHostUrl,
        signalingUrl: meetingFields.signalingUrl,
        turnControlUrl: meetingFields.turnControlUrl,
      },
    },
    { ...meetingFields },
  );
}

export function useMeeting() {
  const [joinedMeetingId, setJoinedMeetingId] = useState("");
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [error, setError] = useState("");
  const meetingManager = useMeetingManager();
  const attendeeNameRef = useRef(generateAttendeeName());

  const handleJoinMeeting = useCallback(
    async (meetingPin: string, action: LoadingAction = "join") => {
      if (!isValidMeetingName(meetingPin)) {
        setError(
          "Invalid meeting PIN. Only alphanumeric characters, underscores, and dashes are allowed.",
        );
        return;
      }

      setError("");
      setLoadingAction(action);
      try {
        const meetingFieldsResponse = await client.queries.getMeetingMetadata({
          meetingName: meetingPin,
          attendeeName: attendeeNameRef.current,
        });

        const meetingFields = meetingFieldsResponse.data!;
        const meetingSessionConfiguration = buildMeetingSessionConfig(
          meetingFields as unknown as Record<string, string>,
        );

        await meetingManager.join(meetingSessionConfiguration, {
          deviceLabels: DeviceLabels.AudioAndVideo,
        });
        await meetingManager.start();
        meetingManager.invokeDeviceProvider(DeviceLabels.AudioAndVideo);
        setJoinedMeetingId(meetingPin);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to join meeting.";
        setError(message);
      } finally {
        setLoadingAction(null);
      }
    },
    [meetingManager],
  );

  const handleStartMeeting = useCallback(async () => {
    await handleJoinMeeting(generateMeetingPin(), "start");
  }, [handleJoinMeeting]);

  useEffect(() => {
    const path = parseMeetingPinFromPath(window.location.pathname);
    if (path.length) {
      handleJoinMeeting(path, "auto");
    }
  }, [handleJoinMeeting]);

  return {
    joinedMeetingId,
    loadingAction,
    error,
    handleJoinMeeting,
    handleStartMeeting,
    attendeeName: attendeeNameRef.current,
  };
}

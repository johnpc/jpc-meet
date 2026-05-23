import { FeaturedVideoTileProvider } from "amazon-chime-sdk-component-library-react";
import config from "../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import {
  MeetingProvider,
  useMeetingManager,
  DeviceLabels,
} from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import { v4 as uuidv4 } from "uuid";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";
import MeetingControlBar from "./components/MeetingControlBar";
import VideoMeeting from "./components/VideoMeeting";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { Card, useTheme, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useCallback, useEffect, useState } from "react";
import { CopyLink } from "./components/CopyLink";
import { AttendeeList } from "./components/AttendeeList";

type LoadingAction = "start" | "join" | "auto" | null;
Amplify.configure(config);

const client = generateClient<Schema>();

function generateMeetingPin(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}

function MeetingApp() {
  const { tokens } = useTheme();
  const [joinedMeetingId, setJoinedMeetingId] = useState("");
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [error, setError] = useState("");
  const meetingManager = useMeetingManager();

  const isValidMeetingName = (meetingName: string) => {
    return /^[a-zA-Z0-9_-]+$/.test(meetingName);
  };

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
          attendeeName: uuidv4(),
        });

        const meetingFields = meetingFieldsResponse.data!;
        const meetingSessionConfiguration = new MeetingSessionConfiguration(
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

        const options = {
          deviceLabels: DeviceLabels.AudioAndVideo,
        };

        await meetingManager.join(meetingSessionConfiguration, options);
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

  useEffect(() => {
    let path = window.location.pathname;
    if (path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
    if (path.length) {
      handleJoinMeeting(path, "auto");
    }
  }, [handleJoinMeeting]);

  return (
    <>
      <Header />
      <View marginTop={tokens.space.medium}>
        {joinedMeetingId ? (
          <>
            <AttendeeList />
            <Card variation="elevated">
              <VideoMeeting />
              <CopyLink
                link={`${window.location.protocol}//${window.location.hostname}/${joinedMeetingId}`}
              />
            </Card>
          </>
        ) : (
          <LandingPage
            onJoinMeeting={handleJoinMeeting}
            onStartMeeting={() =>
              handleJoinMeeting(generateMeetingPin(), "start")
            }
            loadingAction={loadingAction}
            error={error}
          />
        )}
        <MeetingControlBar />
      </View>
    </>
  );
}

function App() {
  return (
    <MeetingProvider>
      <FeaturedVideoTileProvider>
        <MeetingApp />
      </FeaturedVideoTileProvider>
    </MeetingProvider>
  );
}

export default App;

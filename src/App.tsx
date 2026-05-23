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
import { useEffect, useState } from "react";
import { CopyLink } from "./components/CopyLink";
import { AttendeeList } from "./components/AttendeeList";
Amplify.configure(config);

const client = generateClient<Schema>();

function MeetingApp() {
  const { tokens } = useTheme();
  const [joinedMeetingId, setJoinedMeetingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const meetingManager = useMeetingManager();

  const isValidMeetingName = (meetingName: string) => {
    return /^[a-zA-Z0-9_-]+$/.test(meetingName);
  };

  const handleJoinMeeting = async (meetingPin: string) => {
    if (!isValidMeetingName(meetingPin)) {
      alert(
        "Invalid meeting PIN. Only alphanumeric characters, underscores, and dashes are allowed.",
      );
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let path = window.location.pathname;
    if (path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
    if (path.length) {
      handleJoinMeeting(path);
    }
  }, []);

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
            isLoading={isLoading}
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

import { FeaturedVideoTileProvider } from "amazon-chime-sdk-component-library-react";
import config from "../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { MeetingProvider } from "amazon-chime-sdk-component-library-react";
import MeetingControlBar from "./components/MeetingControlBar";
import VideoMeeting from "./components/VideoMeeting";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { Card, useTheme, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { CopyLink } from "./components/CopyLink";
import { AttendeeList } from "./components/AttendeeList";
import { useMeeting } from "./hooks/useMeeting";

Amplify.configure(config);

function MeetingApp() {
  const { tokens } = useTheme();
  const {
    joinedMeetingId,
    loadingAction,
    error,
    handleJoinMeeting,
    handleStartMeeting,
  } = useMeeting();

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
            onStartMeeting={handleStartMeeting}
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

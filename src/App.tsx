import { FeaturedVideoTileProvider } from "amazon-chime-sdk-component-library-react";
import config from "../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { MeetingProvider } from "amazon-chime-sdk-component-library-react";
import MeetingControlBar from "./components/MeetingControlBar";
import VideoMeeting from "./components/VideoMeeting";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { Card, Flex, useTheme, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { CopyLink } from "./components/CopyLink";
import { AttendeeList } from "./components/AttendeeList";
import { useMeeting } from "./hooks/useMeeting";
import { ChatProvider } from "./context/ChatContext";
import { ChatPanel } from "./components/ChatPanel";

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
          <ChatProvider>
            <AttendeeList />
            <Flex direction="row" style={{ height: "60vh" }}>
              <Card variation="elevated" style={{ flex: 1 }}>
                <VideoMeeting />
                <CopyLink
                  link={`${window.location.protocol}//${window.location.hostname}/${joinedMeetingId}`}
                />
              </Card>
              <ChatPanel />
            </Flex>
            <MeetingControlBar />
          </ChatProvider>
        ) : (
          <>
            <LandingPage
              onJoinMeeting={handleJoinMeeting}
              onStartMeeting={handleStartMeeting}
              loadingAction={loadingAction}
              error={error}
            />
            <MeetingControlBar />
          </>
        )}
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

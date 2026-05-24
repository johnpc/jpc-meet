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
import "./App.css";
import { CopyLink } from "./components/CopyLink";
import { AttendeeList } from "./components/AttendeeList";
import { useMeeting } from "./hooks/useMeeting";
import {
  AttendeeNamesProvider,
  useAttendeeNamesContext,
} from "./context/AttendeeNamesContext";
import { ChatProvider } from "./context/ChatContext";
import { ChatPanel } from "./components/ChatPanel";

Amplify.configure(config);

function MeetingView({
  joinedMeetingId,
  attendeeName,
  setAttendeeName,
}: {
  joinedMeetingId: string;
  attendeeName: string;
  setAttendeeName: (name: string) => void;
}) {
  const { broadcastNameChange } = useAttendeeNamesContext();

  const handleNameChange = (newName: string) => {
    setAttendeeName(newName);
    broadcastNameChange(newName);
  };

  return (
    <ChatProvider senderName={attendeeName}>
      <AttendeeList />
      <div className="meeting-layout">
        <Card variation="elevated" style={{ flex: 1 }}>
          <VideoMeeting />
          <CopyLink
            link={`${window.location.protocol}//${window.location.hostname}/${joinedMeetingId}`}
          />
        </Card>
        <ChatPanel />
      </div>
      <MeetingControlBar
        attendeeName={attendeeName}
        onNameChange={handleNameChange}
      />
    </ChatProvider>
  );
}

function MeetingApp() {
  const { tokens } = useTheme();
  const {
    joinedMeetingId,
    loadingAction,
    error,
    handleJoinMeeting,
    handleStartMeeting,
    attendeeName,
    setAttendeeName,
  } = useMeeting();

  return (
    <>
      <Header />
      <View marginTop={tokens.space.medium}>
        {joinedMeetingId ? (
          <AttendeeNamesProvider>
            <MeetingView
              joinedMeetingId={joinedMeetingId}
              attendeeName={attendeeName}
              setAttendeeName={setAttendeeName}
            />
          </AttendeeNamesProvider>
        ) : (
          <>
            <LandingPage
              onJoinMeeting={handleJoinMeeting}
              onStartMeeting={handleStartMeeting}
              loadingAction={loadingAction}
              error={error}
              attendeeName={attendeeName}
              onAttendeeNameChange={setAttendeeName}
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

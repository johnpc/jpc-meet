import { FeaturedVideoTileProvider } from "amazon-chime-sdk-component-library-react";
import config from "../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { MeetingProvider } from "amazon-chime-sdk-component-library-react";
import MeetingControlBar from "./components/MeetingControlBar";
import VideoMeeting from "./components/VideoMeeting";
import { Header } from "./components/Header";
import { Card, useTheme, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useState } from "react";
import { CopyLink } from "./components/CopyLink";
Amplify.configure(config);

function App() {
  const { tokens } = useTheme();
  const [joinedMeetingId, setJoinedMeetingId] = useState("");

  return (
    <>
      <Header />
      <View marginTop={tokens.space.medium}>
        <MeetingProvider>
          <FeaturedVideoTileProvider>
            {joinedMeetingId ? (
              <Card variation="elevated">
                <VideoMeeting />
                <CopyLink
                  link={`${window.location.protocol}//${window.location.hostname}/${joinedMeetingId}`}
                />
              </Card>
            ) : (
              <Card variation="elevated">You're not in a meeting yet!</Card>
            )}
            <MeetingControlBar setJoinedMeetingId={setJoinedMeetingId} />
          </FeaturedVideoTileProvider>
        </MeetingProvider>
      </View>
    </>
  );
}

export default App;

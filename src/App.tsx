import { FeaturedVideoTileProvider } from "amazon-chime-sdk-component-library-react";
import config from "../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { MeetingProvider } from "amazon-chime-sdk-component-library-react";
import MeetingControlBar from "./components/MeetingControlBar";
import VideoMeeting from "./components/VideoMeeting";
import { Header } from "./components/Header";
import { Card, useTheme, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
Amplify.configure(config);

function App() {
  const { tokens } = useTheme();
  return (
    <>
      <Header />
      <View marginTop={tokens.space.medium}>
        <MeetingProvider>
          <FeaturedVideoTileProvider>
            <Card variation="elevated">
              <VideoMeeting />
            </Card>
            <MeetingControlBar />
          </FeaturedVideoTileProvider>
        </MeetingProvider>
      </View>
    </>
  );
}

export default App;

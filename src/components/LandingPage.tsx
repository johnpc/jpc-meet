import { useState } from "react";
import {
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Loader,
  Text,
  TextField,
  useTheme,
  View,
} from "@aws-amplify/ui-react";

interface LandingPageProps {
  onJoinMeeting: (meetingPin: string) => Promise<void>;
  isLoading: boolean;
}

export const LandingPage = ({ onJoinMeeting, isLoading }: LandingPageProps) => {
  const { tokens } = useTheme();
  const [meetingPin, setMeetingPin] = useState("");
  const [error, setError] = useState("");

  const handleStartNewMeeting = async () => {
    const randomPin = Math.random().toString(36).substring(2, 8);
    await onJoinMeeting(randomPin);
  };

  const handleJoinMeeting = async () => {
    if (!meetingPin.trim()) {
      setError("Please enter a meeting PIN.");
      return;
    }
    setError("");
    await onJoinMeeting(meetingPin.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoinMeeting();
    }
  };

  return (
    <View
      maxWidth="600px"
      margin="0 auto"
      padding={tokens.space.large}
    >
      <Flex direction="column" alignItems="center" gap={tokens.space.large}>
        {/* Hero Section */}
        <Flex
          direction="column"
          alignItems="center"
          gap={tokens.space.small}
          textAlign="center"
        >
          <Heading level={2}>Video Conferencing Made Simple</Heading>
          <Text
            fontSize={tokens.fontSizes.large}
            color={tokens.colors.font.secondary}
          >
            Start or join a video call instantly. No sign-up required.
          </Text>
        </Flex>

        {/* Start New Meeting Section */}
        <Card variation="elevated" width="100%" padding={tokens.space.large}>
          <Flex direction="column" alignItems="center" gap={tokens.space.medium}>
            <Heading level={4}>Start a New Meeting</Heading>
            <Text
              textAlign="center"
              color={tokens.colors.font.secondary}
            >
              Create a meeting and share the PIN with others to invite them.
            </Text>
            <Button
              variation="primary"
              size="large"
              isFullWidth={true}
              onClick={handleStartNewMeeting}
              isLoading={isLoading}
              loadingText="Starting..."
            >
              Start Meeting
            </Button>
          </Flex>
        </Card>

        <Flex
          direction="row"
          alignItems="center"
          gap={tokens.space.medium}
          width="100%"
        >
          <Divider />
          <Text color={tokens.colors.font.secondary} whiteSpace="nowrap">
            or
          </Text>
          <Divider />
        </Flex>

        {/* Join Existing Meeting Section */}
        <Card variation="elevated" width="100%" padding={tokens.space.large}>
          <Flex direction="column" gap={tokens.space.medium}>
            <Heading level={4} textAlign="center">
              Join an Existing Meeting
            </Heading>
            <Text
              textAlign="center"
              color={tokens.colors.font.secondary}
            >
              Enter the meeting PIN shared with you.
            </Text>
            <TextField
              label="Meeting PIN"
              labelHidden
              placeholder="Enter meeting PIN"
              value={meetingPin}
              onChange={(e) => {
                setMeetingPin(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={handleKeyDown}
              hasError={!!error}
              errorMessage={error}
              isDisabled={isLoading}
            />
            <Button
              variation="primary"
              size="large"
              isFullWidth={true}
              onClick={handleJoinMeeting}
              isLoading={isLoading}
              loadingText="Joining..."
            >
              Join Meeting
            </Button>
          </Flex>
        </Card>

        {/* Feature Highlights */}
        <Flex
          direction="row"
          wrap="wrap"
          justifyContent="center"
          gap={tokens.space.medium}
          paddingTop={tokens.space.small}
        >
          <Card padding={tokens.space.small}>
            <Text fontSize={tokens.fontSizes.small} textAlign="center">
              No sign-up required
            </Text>
          </Card>
          <Card padding={tokens.space.small}>
            <Text fontSize={tokens.fontSizes.small} textAlign="center">
              Share your PIN to invite others
            </Text>
          </Card>
          <Card padding={tokens.space.small}>
            <Text fontSize={tokens.fontSizes.small} textAlign="center">
              Screen sharing & recording
            </Text>
          </Card>
        </Flex>

        {/* Loading indicator for URL-based auto-join */}
        {isLoading && (
          <Flex direction="column" alignItems="center" gap={tokens.space.small}>
            <Loader size="large" />
            <Text color={tokens.colors.font.secondary}>
              Connecting to meeting...
            </Text>
          </Flex>
        )}
      </Flex>
    </View>
  );
};

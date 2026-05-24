import { useState } from "react";
import {
  Alert,
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

type LoadingAction = "start" | "join" | "auto" | null;

interface LandingPageProps {
  onJoinMeeting: (meetingPin: string, action?: LoadingAction) => Promise<void>;
  onStartMeeting: () => Promise<void>;
  loadingAction: LoadingAction;
  error: string;
  attendeeName: string;
  onAttendeeNameChange: (name: string) => void;
}

export const LandingPage = ({
  onJoinMeeting,
  onStartMeeting,
  loadingAction,
  error,
  attendeeName,
  onAttendeeNameChange,
}: LandingPageProps) => {
  const { tokens } = useTheme();
  const [meetingPin, setMeetingPin] = useState("");
  const [localError, setLocalError] = useState("");

  const handleStartNewMeeting = async () => {
    if (!attendeeName.trim()) {
      setLocalError("Please enter your name.");
      return;
    }
    await onStartMeeting();
  };

  const handleJoinMeeting = async () => {
    if (!attendeeName.trim()) {
      setLocalError("Please enter your name.");
      return;
    }
    if (!meetingPin.trim()) {
      setLocalError("Please enter a meeting PIN.");
      return;
    }
    setLocalError("");
    await onJoinMeeting(meetingPin.trim(), "join");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoinMeeting();
    }
  };

  const displayError = localError || error;

  return (
    <View maxWidth="600px" margin="0 auto" padding={tokens.space.large}>
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

        {/* Error display */}
        {displayError && (
          <Alert variation="error" isDismissible={false} width="100%">
            {displayError}
          </Alert>
        )}

        {/* Your Name Input */}
        <Card variation="elevated" width="100%" padding={tokens.space.large}>
          <Flex direction="column" gap={tokens.space.medium}>
            <TextField
              label="Your Name"
              placeholder="Enter your name"
              value={attendeeName}
              onChange={(e) => {
                onAttendeeNameChange(e.target.value);
                if (localError) setLocalError("");
              }}
              isDisabled={loadingAction !== null}
            />
          </Flex>
        </Card>

        {/* Start New Meeting Section */}
        <Card variation="elevated" width="100%" padding={tokens.space.large}>
          <Flex
            direction="column"
            alignItems="center"
            gap={tokens.space.medium}
          >
            <Heading level={4}>Start a New Meeting</Heading>
            <Text textAlign="center" color={tokens.colors.font.secondary}>
              Create a meeting and share the PIN with others to invite them.
            </Text>
            <Button
              variation="primary"
              size="large"
              isFullWidth={true}
              onClick={handleStartNewMeeting}
              isLoading={loadingAction === "start"}
              isDisabled={loadingAction !== null}
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
            <Text textAlign="center" color={tokens.colors.font.secondary}>
              Enter the meeting PIN shared with you.
            </Text>
            <TextField
              label="Meeting PIN"
              labelHidden
              placeholder="Enter meeting PIN"
              value={meetingPin}
              onChange={(e) => {
                setMeetingPin(e.target.value);
                if (localError) setLocalError("");
              }}
              onKeyDown={handleKeyDown}
              hasError={!!localError}
              errorMessage={localError}
              isDisabled={loadingAction !== null}
            />
            <Button
              variation="primary"
              size="large"
              isFullWidth={true}
              onClick={handleJoinMeeting}
              isLoading={loadingAction === "join"}
              isDisabled={loadingAction !== null}
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
        {loadingAction === "auto" && (
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

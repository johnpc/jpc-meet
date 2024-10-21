import {
  Card,
  View,
  Heading,
  Text,
  useTheme,
  Grid,
  Image,
  Flex,
} from "@aws-amplify/ui-react";

export const Header = () => {
  const { tokens } = useTheme();
  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <Grid templateColumns="4fr" templateRows="4rem" gap={tokens.space.small}>
      <View>
        <Card onClick={() => goHome()}>
          <Flex
            direction="row"
            justifyContent="flex-start"
            alignItems="stretch"
            alignContent="flex-start"
            wrap="nowrap"
            gap="1rem"
          >
            <View height="2rem">
              <Image
                objectFit={"initial"}
                src="/maskable.png"
                alt="icon"
                borderRadius={tokens.radii.large}
                height={"50px"}
              ></Image>
            </View>
            <View height="2rem">
              <Heading level={5}>meet.jpc.io</Heading>
              <Text as="span" fontSize={"small"}>
                Zero-auth video conferencing
              </Text>
            </View>
          </Flex>
        </Card>
      </View>
    </Grid>
  );
};

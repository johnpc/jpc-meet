import { Button, useTheme } from "@aws-amplify/ui-react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const CopyLink = (props: { link: string }) => {
  const { tokens } = useTheme();
  const [copied, setCopied] = useState(false);
  const fileUrl = props.link;
  return (
    <CopyToClipboard
      text={fileUrl}
      onCopy={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }}
    >
      <Button
        marginBottom={tokens.space.medium}
        marginTop={tokens.space.medium}
        isFullWidth
        colorTheme={copied ? "success" : undefined}
      >
        {copied ? "✅" : "Copy link to Clipboard"}
      </Button>
    </CopyToClipboard>
  );
};

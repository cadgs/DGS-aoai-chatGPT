import { Stack } from "@fluentui/react";
import { SquareRegular } from "@fluentui/react-icons";

import styles from "./ChatButtonStopGenerating.module.css";

interface ChatButtonStopGeneratingProps {
  stopGenerating: () => void;
}

const ChatButtonStopGenerating: React.FC<ChatButtonStopGeneratingProps> = ({
  stopGenerating,
}) => {
  return (
    <Stack
      horizontal
      className={styles.stopGeneratingContainer}
      role="button"
      aria-label="Stop generating"
      tabIndex={0}
      onClick={stopGenerating}
      onKeyDown={(e) =>
        e.key === "Enter" || e.key === " " ? stopGenerating() : null
      }
    >
      <SquareRegular className={styles.stopGeneratingIcon} aria-hidden="true" />
      <span className={styles.stopGeneratingText} aria-hidden="true">
        Stop generating
      </span>
    </Stack>
  );
};

export default ChatButtonStopGenerating;

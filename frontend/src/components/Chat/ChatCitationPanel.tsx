import { useContext } from "react";
import { IconButton, Stack } from "@fluentui/react";

import { Citation } from "../../api";

import DOMPurify from "dompurify";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import { XSSAllowTags } from "../../constants/xssAllowTags";

import { ChatStateContext } from "../../state/ChatProvider";
import styles from "./ChatCitationPanel.module.css";

const ChatCitationPanel = () => {
  const chatStateContext = useContext(ChatStateContext);
  const activeCitation = chatStateContext?.state.activeCitation;

  // Add facade for chatStateContext function setIsCitationPanelOpen
  const setIsCitationPanelOpen = (isCitationPanelOpen: boolean) => {
    chatStateContext?.dispatch({
      type: "SET_CITATION_PANEL_OPEN",
      payload: isCitationPanelOpen,
    });
  };

  const onViewSource = (citation: Citation | null | undefined) => {
    if (citation?.url && !citation.url.includes("blob.core")) {
      window.open(citation.url, "_blank");
    }
  };

  return (
    <Stack.Item
      className={styles.citationPanel}
      tabIndex={0}
      role="tabpanel"
      aria-label="Citations Panel"
    >
      <Stack
        aria-label="Citations Panel Header Container"
        horizontal
        className={styles.citationPanelHeaderContainer}
        horizontalAlign="space-between"
        verticalAlign="center"
      >
        <span aria-label="Citations" className={styles.citationPanelHeader}>
          Citations
        </span>
        <IconButton
          iconProps={{ iconName: "Cancel" }}
          aria-label="Close citations panel"
          onClick={() => setIsCitationPanelOpen(false)}
        />
      </Stack>
      <h5
        className={styles.citationPanelTitle}
        tabIndex={0}
        title={
          activeCitation?.url && !activeCitation?.url.includes("blob.core")
            ? activeCitation.url
            : activeCitation?.title ?? ""
        }
        onClick={() => onViewSource(activeCitation)}
      >
        {activeCitation?.title}
      </h5>
      <div tabIndex={0}>
        <ReactMarkdown
          linkTarget="_blank"
          className={styles.citationPanelContent}
          children={DOMPurify.sanitize(activeCitation?.content ?? "", {
            ALLOWED_TAGS: XSSAllowTags,
          })}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        />
      </div>
    </Stack.Item>
  );
};

export default ChatCitationPanel;

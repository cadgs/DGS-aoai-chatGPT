import { useRef, useEffect, useLayoutEffect, useContext } from "react";
import { Stack } from "@fluentui/react";
import { ErrorCircleRegular } from "@fluentui/react-icons";
import { messageStatus } from "../../api/models";
import {
  ChatMessage,
  Citation,
  ToolMessageContent,
  ChatHistoryLoadingState,
  CosmosDBStatus,
} from "../../api";

import { ERROR } from "../../constants/chatConstants";

import styles from "./ChatAnswer.module.css";
import { Answer } from "../../components/Answer";
import { AppStateContext } from "../../state/AppProvider";
import { ChatStateContext } from "../../state/ChatProvider";

const ChatAnswer = () => {
  const appStateContext = useContext(AppStateContext);
  const chatStateContext = useContext(ChatStateContext);

  const messages = chatStateContext?.state.messages ?? [];
  const processMessages = chatStateContext?.state.processMessages;
  const showLoadingMessage = chatStateContext?.state.showLoadingMessage;

  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

  // Add facade for chatStateContext function setActiveCitation
  const setActiveCitation = (activeCitation: Citation | null) => {
    chatStateContext?.dispatch({
      type: "SET_ACTIVE_CITATION",
      payload: activeCitation,
    });
  };

  // Add facade for chatStateContext function setIsCitationPanelOpen
  const setIsCitationPanelOpen = (isCitationPanelOpen: boolean) => {
    chatStateContext?.dispatch({
      type: "SET_CITATION_PANEL_OPEN",
      payload: isCitationPanelOpen,
    });
  };

  const onShowCitation = (citation: Citation) => {
    setActiveCitation(citation);
    setIsCitationPanelOpen(true);
  };

  useLayoutEffect(() => {
    chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [showLoadingMessage, processMessages]);

  const parseCitationFromMessage = (message: ChatMessage) => {
    if (message?.role && message?.role === "tool") {
      try {
        const toolMessage = JSON.parse(message.content) as ToolMessageContent;
        return toolMessage.citations;
      } catch {
        return [];
      }
    }
    return [];
  };

  return (
    <div
      className={styles.chatMessageStream}
      style={{
        marginBottom: chatStateContext?.state.isLoading ? "40px" : "0px",
      }}
      role="log"
    >
      {messages.map((answer, index) => (
        <>
          {answer.role === "user" ? (
            <div className={styles.chatMessageUser} tabIndex={0}>
              <div className={styles.chatMessageUserMessage}>
                {answer.content}
              </div>
            </div>
          ) : answer.role === "assistant" ? (
            <div className={styles.chatMessageGpt}>
              <Answer
                answer={{
                  answer: answer.content,
                  citations: parseCitationFromMessage(messages[index - 1]),
                  message_id: answer.id,
                  feedback: answer.feedback,
                }}
                onCitationClicked={(c) => onShowCitation(c)}
              />
            </div>
          ) : answer.role === ERROR ? (
            <div className={styles.chatMessageError}>
              <Stack horizontal className={styles.chatMessageErrorContent}>
                <ErrorCircleRegular
                  className={styles.errorIcon}
                  style={{ color: "rgba(182, 52, 67, 1)" }}
                />
                <span>Error</span>
              </Stack>
              <span className={styles.chatMessageErrorContent}>
                {answer.content}
              </span>
            </div>
          ) : null}
        </>
      ))}
      {showLoadingMessage && (
        <>
          <div className={styles.chatMessageGpt}>
            <Answer
              answer={{
                answer: "Generating answer...",
                citations: [],
              }}
              onCitationClicked={() => null}
            />
          </div>
        </>
      )}
      <div ref={chatMessageStreamEnd} />
    </div>
  );
};

export default ChatAnswer;

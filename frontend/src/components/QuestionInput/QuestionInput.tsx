import { useState, useContext, useEffect } from "react";
import { Stack, TextField, isDark } from "@fluentui/react";
import { SendRegular } from "@fluentui/react-icons";
import { AppStateContext } from "../../state/AppProvider";
import useLocalStorage from "use-local-storage";
import Send from "../../assets/Send.svg";
import styles from "./QuestionInput.module.css";
import { ChatStateContext } from "../../state/ChatProvider";

interface Props {
  onSend: (question: string, id?: string) => void;
  disabled: boolean;
  placeholder?: string;
  clearOnSend?: boolean;
  conversationId?: string;
}

export const QuestionInput = ({
  onSend,
  disabled,
  placeholder,
  clearOnSend,
  conversationId,
}: Props) => {
  // allow user to send init questions by clicking Init Question buttons
  const chatStateContext = useContext(ChatStateContext);
  const initQuestion = chatStateContext?.state.initQuestion;

  const [question, setQuestion] = useState<string>("");

  //const appStateContext = useContext(AppStateContext);
  //const isDark: boolean | undefined = appStateContext?.state.isDarkMode;

  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);

  useEffect(() => {
    if (initQuestion != "") {
      //setQuestion(initQuestion || "");
      //sendQuestion();
      onSend(initQuestion || "");
      //setQuestion("");
    }
  }, [initQuestion]);

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return;
    }

    if (conversationId) {
      onSend(question, conversationId);
    } else {
      onSend(question);
    }

    if (clearOnSend) {
      setQuestion("");
    }
  };

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (
      ev.key === "Enter" &&
      !ev.shiftKey &&
      !(ev.nativeEvent?.isComposing === true)
    ) {
      ev.preventDefault();
      sendQuestion();
    }
  };

  const onQuestionChange = (
    _ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    setQuestion(newValue || "");
  };

  const sendQuestionDisabled = disabled || !question.trim();

  const textFieldStyles = {
    background: isDark ? "#616161" : "#f6f6f6",
    color: isDark ? "#ffffff" : "#060606",
  };

  return (
    <Stack horizontal className={styles.questionInputContainer}>
      <TextField
        className={styles.questionInputTextArea}
        placeholder={placeholder}
        multiline
        resizable={false}
        borderless
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onEnterPress}
        style={{
          background: isDark ? "#616161" : "#f6f6f6",
          color: isDark ? "#ffffff" : "#060606",
        }}
      />
      <div
        className={styles.questionInputSendButtonContainer}
        role="button"
        tabIndex={0}
        aria-label="Ask question button"
        onClick={sendQuestion}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " " ? sendQuestion() : null
        }
      >
        {sendQuestionDisabled ? (
          <SendRegular className={styles.questionInputSendButtonDisabled} />
        ) : (
          <img src={Send} className={styles.questionInputSendButton} />
        )}
      </div>
      <div className={styles.questionInputBottomBorder} />
    </Stack>
  );
};

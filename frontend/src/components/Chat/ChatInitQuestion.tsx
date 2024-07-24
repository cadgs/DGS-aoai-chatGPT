import { useContext } from "react";
import styles from "./ChatInitQuestion.module.css";
import { ChatStateContext } from "../../state/ChatProvider";
import { CommandBarButton, DefaultButton } from "@fluentui/react";

interface ChatInitQuestionProps {
  iconDrawing: string;
  displayText: string;
  questionText: string;
  iconMd: string;
}

const ChatInitQuestion: React.FC<ChatInitQuestionProps> = ({
  iconDrawing,
  displayText,
  questionText,
  iconMd,
}) => {
  const chatStateContext = useContext(ChatStateContext);

  const setInitQuestion = () => {
    chatStateContext?.dispatch({
      type: "SET_INIT_QUESTION",
      payload: questionText,
    });
  };

  return (
    <button className={styles.buttonInitQuestion} onClick={setInitQuestion}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={styles[iconMd]}
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d={iconDrawing}
        ></path>
      </svg>
      <div className={styles.buttonInitQuestionText}>{displayText}</div>
    </button>
  );
};

export default ChatInitQuestion;

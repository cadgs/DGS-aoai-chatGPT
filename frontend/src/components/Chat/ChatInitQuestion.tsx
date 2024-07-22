import styles from "./ChatInitQuestion.module.css";

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
  return (
    <button className={styles.buttonInitQuestion}>
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

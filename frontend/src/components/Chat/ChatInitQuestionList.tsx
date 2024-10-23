import { Stack } from "@fluentui/react";
import ChatInitQuestion from "./ChatInitQuestion";
import styles from "./ChatInitQuestionList.module.css";

const ChatInitQuestionList = () => {
  // Prepare the dummpy init question list, later we could load the questions on the fly...
  const initQuestionList = [
    [
      "M15 19a3 3 0 1 1-6 0M15.865 16A7.54 7.54 0 0 0 19.5 9.538C19.5 5.375 16.142 2 12 2S4.5 5.375 4.5 9.538A7.54 7.54 0 0 0 8.135 16m7.73 0h-7.73m7.73 0v3h-7.73v-3",
      "Interview questions",
      "Write five interview questions for an associate governmental program analyst position that explore a candidate’s logical and technical skills.",
      "iconMd1",
    ],
    [
      "M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm1.293 4.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414L8.586 12l-1.293-1.293a1 1 0 0 1 0-1.414M12 14a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1",
      "Write an agenda for a meeting",
      "Write an agenda for a 45-minute meeting with a group of new project team. The project is about on premise file storage on migration to SharePoint Online.  For each agenda item, include approximately how long it will take and the purpose of each activity.",
      "iconMd2",
    ],
    [
      "M13.428 17.572 20.5 10.5a2.828 2.828 0 1 0-4-4l-7.072 7.072a2 2 0 0 0-.547 1.022L8 19l4.406-.881a2 2 0 0 0 1.022-.547",
      "How to submit ServiceNow Ticket",
      "Please provide instructions on how to submit a ServiceNow ticket.",
      "iconMd3",
    ],
    [
      "M13.997 3.39A2.5 2.5 0 0 1 17.2 2.103l2.203.882a2.5 2.5 0 0 1 1.342 3.369L19.063 10H20a1 1 0 0 1 1 1v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8a1 1 0 0 1 .992-1l-.149-.101-.03-.022c-1.254-.924-1.016-2.864.425-3.458l2.12-.874.724-2.176c.492-1.479 2.41-1.851 3.42-.665L11.99 4.45l1.521.01zm1.513 1.506a2 2 0 0 1 .461 2.618l-1.144 1.861v.045a1.3 1.3 0 0 0 .044.278 1 1 0 0 1 .047.302h1.942l2.07-4.485a.5.5 0 0 0-.268-.673l-2.203-.882a.5.5 0 0 0-.641.258zM12.889 10a3.3 3.3 0 0 1-.06-.499c-.01-.236-.004-.69.237-1.081l1.202-1.954-2.293-.016a2 2 0 0 1-1.51-.704L8.98 4l-.725 2.176A2 2 0 0 1 7.12 7.394L5 8.267l2.063 1.407c.129.087.23.2.303.326zM5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7zm4.5 2.5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1",
      "Help me on data analysis",
      "Please act as a data scientist working on a complex project. Your task is to analyze a large dataset, uncover valuable insights, and deliver actionable recommendations aimed at improving data quality and reducing costs.",
      "iconMd4",
    ],
  ];

  return (
    <>
    <h2 className={styles.title}>Sample prompts</h2> 
     
    <Stack
      horizontal
      horizontalAlign="space-between"
      className={styles.initQuestionContainer}
    >
      {initQuestionList.map((q, i) => (
        <ChatInitQuestion
          iconDrawing={q[0]}
          displayText={q[1]}
          questionText={q[2]}
          iconMd={q[3]}
        />
      ))}
    </Stack>
    </>
  );
};

export default ChatInitQuestionList;

import { useRef, useEffect, useLayoutEffect, useContext } from "react";
import {
  ChatMessage,
  ConversationRequest,
  conversationApi,
  ChatResponse,
  Conversation,
  historyGenerate,
  historyUpdate,
  ChatHistoryLoadingState,
  CosmosDBStatus,
  ErrorMessage,
} from "../../api";
import uuid from "react-uuid";
import { isEmpty } from "lodash";
import { ASSISTANT, TOOL, ERROR } from "../../constants/chatConstants";

import { messageStatus } from "../../api/models";
import { QuestionInput } from "../../components/QuestionInput";
import { AppStateContext } from "../../state/AppProvider";
import { ChatStateContext } from "../../state/ChatProvider";

const ChatQuestionInput = () => {
  const appStateContext = useContext(AppStateContext);
  const chatStateContext = useContext(ChatStateContext);

  const abortFuncs = useRef([] as AbortController[]);
  const NO_CONTENT_ERROR = "No content in messages object.";

  let assistantMessage = {} as ChatMessage;
  let toolMessage = {} as ChatMessage;
  let assistantContent = "";

  // Add facade for chatStateContext function setIsLoading
  const setIsLoading = (isLoading: boolean) => {
    chatStateContext?.dispatch({
      type: "SET_LOADING",
      payload: isLoading,
    });
  };

  // Add facade for chatStateContext function setMessages
  const messages = chatStateContext?.state.messages ?? [];
  const setMessages = (messages: ChatMessage[]) => {
    chatStateContext?.dispatch({
      type: "SET_MESSAGES",
      payload: messages,
    });
  };

  // Add facade for chatStateContext function setShowLoadingMessage
  const showLoadingMessage = chatStateContext?.state.showLoadingMessage;
  const setShowLoadingMessage = (showLoadingMessage: boolean) => {
    chatStateContext?.dispatch({
      type: "SET_SHOW_LOADING_MESSAGE",
      payload: showLoadingMessage,
    });
  };

  // Add facade for chatStateContext function setProcessMessages
  const processMessages = chatStateContext?.state.processMessages;
  const setProcessMessages = (processMessages: messageStatus) => {
    chatStateContext?.dispatch({
      type: "PROCESS_MESSAGES",
      payload: processMessages,
    });
  };

  // Add facade for chatStateContext function toggleErrorDialog
  const hideErrorDialog = chatStateContext?.state.hideErrorDialog;
  const toggleErrorDialog = () => {
    chatStateContext?.dispatch({
      type: "TOGGLE_HIDE_ERR_DIALOG",
    });
  };

  // Add facade for chatStateContext function setErrorMsg
  const setErrorMsg = (errorMsg: ErrorMessage | null) => {
    chatStateContext?.dispatch({
      type: "SET_ERR_MESSAGE",
      payload: errorMsg,
    });
  };

  useEffect(() => {
    if (
      appStateContext?.state.isCosmosDBAvailable?.status !==
        CosmosDBStatus.Working &&
      appStateContext?.state.isCosmosDBAvailable?.status !==
        CosmosDBStatus.NotConfigured &&
      appStateContext?.state.chatHistoryLoadingState ===
        ChatHistoryLoadingState.Fail &&
      hideErrorDialog
    ) {
      let subtitle = `${appStateContext.state.isCosmosDBAvailable.status}. Please contact the site administrator.`;
      setErrorMsg({
        title: "Chat history is not enabled",
        subtitle: subtitle,
      });
      toggleErrorDialog();
    }
  }, [appStateContext?.state.isCosmosDBAvailable]);

  useLayoutEffect(() => {
    const saveToDB = async (messages: ChatMessage[], id: string) => {
      const response = await historyUpdate(messages, id);
      return response;
    };

    if (
      appStateContext &&
      appStateContext.state.currentChat &&
      processMessages === messageStatus.Done
    ) {
      if (appStateContext.state.isCosmosDBAvailable.cosmosDB) {
        if (!appStateContext?.state.currentChat?.messages) {
          console.error("Failure fetching current chat state.");
          return;
        }
        const noContentError = appStateContext.state.currentChat.messages.find(
          (m) => m.role === ERROR
        );

        if (!noContentError?.content.includes(NO_CONTENT_ERROR)) {
          saveToDB(
            appStateContext.state.currentChat.messages,
            appStateContext.state.currentChat.id
          )
            .then((res) => {
              if (!res.ok) {
                let errorMessage =
                  "An error occurred. Answers can't be saved at this time. If the problem persists, please contact the site administrator.";
                let errorChatMsg: ChatMessage = {
                  id: uuid(),
                  role: ERROR,
                  content: errorMessage,
                  date: new Date().toISOString(),
                };
                if (!appStateContext?.state.currentChat?.messages) {
                  let err: Error = {
                    ...new Error(),
                    message: "Failure fetching current chat state.",
                  };
                  throw err;
                }
                setMessages([
                  ...appStateContext?.state.currentChat?.messages,
                  errorChatMsg,
                ]);
              }
              return res as Response;
            })
            .catch((err) => {
              console.error("Error: ", err);
              let errRes: Response = {
                ...new Response(),
                ok: false,
                status: 500,
              };
              return errRes;
            });
        }
      } else {
      }
      appStateContext?.dispatch({
        type: "UPDATE_CHAT_HISTORY",
        payload: appStateContext.state.currentChat,
      });
      setMessages(appStateContext.state.currentChat.messages);
      setProcessMessages(messageStatus.NotRunning);
    }
  }, [processMessages]);

  const processResultMessage = (
    resultMessage: ChatMessage,
    userMessage: ChatMessage,
    conversationId?: string
  ) => {
    if (resultMessage.role === ASSISTANT) {
      assistantContent += resultMessage.content;
      assistantMessage = resultMessage;
      assistantMessage.content = assistantContent;

      if (resultMessage.context) {
        toolMessage = {
          id: uuid(),
          role: TOOL,
          content: resultMessage.context,
          date: new Date().toISOString(),
        };
      }
    }

    if (resultMessage.role === TOOL) toolMessage = resultMessage;

    if (!conversationId) {
      isEmpty(toolMessage)
        ? setMessages([...messages, userMessage, assistantMessage])
        : setMessages([
            ...messages,
            userMessage,
            toolMessage,
            assistantMessage,
          ]);
    } else {
      isEmpty(toolMessage)
        ? setMessages([...messages, assistantMessage])
        : setMessages([...messages, toolMessage, assistantMessage]);
    }
  };

  const makeApiRequestWithoutCosmosDB = async (
    question: string,
    conversationId?: string
  ) => {
    setIsLoading(true);
    setShowLoadingMessage(true);
    const abortController = new AbortController();
    abortFuncs.current.unshift(abortController);

    const userMessage: ChatMessage = {
      id: uuid(),
      role: "user",
      content: question,
      date: new Date().toISOString(),
    };

    let conversation: Conversation | null | undefined;
    if (!conversationId) {
      conversation = {
        id: conversationId ?? uuid(),
        title: question,
        messages: [userMessage],
        date: new Date().toISOString(),
      };
    } else {
      conversation = appStateContext?.state?.currentChat;
      if (!conversation) {
        console.error("Conversation not found.");
        setIsLoading(false);
        setShowLoadingMessage(false);
        abortFuncs.current = abortFuncs.current.filter(
          (a) => a !== abortController
        );
        return;
      } else {
        conversation.messages.push(userMessage);
      }
    }

    appStateContext?.dispatch({
      type: "UPDATE_CURRENT_CHAT",
      payload: conversation,
    });
    setMessages(conversation.messages);

    const request: ConversationRequest = {
      messages: [
        ...conversation.messages.filter((answer) => answer.role !== ERROR),
      ],
    };

    let result = {} as ChatResponse;
    try {
      const response = await conversationApi(request, abortController.signal);
      if (response?.body) {
        const reader = response.body.getReader();

        let runningText = "";
        while (true) {
          setProcessMessages(messageStatus.Processing);
          const { done, value } = await reader.read();
          if (done) break;

          var text = new TextDecoder("utf-8").decode(value);
          const objects = text.split("\n");
          objects.forEach((obj) => {
            try {
              if (obj !== "" && obj !== "{}") {
                runningText += obj;
                result = JSON.parse(runningText);
                if (result.choices?.length > 0) {
                  result.choices[0].messages.forEach((msg) => {
                    msg.id = result.id;
                    msg.date = new Date().toISOString();
                  });
                  if (
                    result.choices[0].messages?.some(
                      (m) => m.role === ASSISTANT
                    )
                  ) {
                    setShowLoadingMessage(false);
                  }
                  result.choices[0].messages.forEach((resultObj) => {
                    processResultMessage(
                      resultObj,
                      userMessage,
                      conversationId
                    );
                  });
                } else if (result.error) {
                  throw Error(result.error);
                }
                runningText = "";
              }
            } catch (e) {
              if (!(e instanceof SyntaxError)) {
                console.error(e);
                throw e;
              } else {
                console.log("Incomplete message. Continuing...");
              }
            }
          });
        }
        conversation.messages.push(toolMessage, assistantMessage);
        appStateContext?.dispatch({
          type: "UPDATE_CURRENT_CHAT",
          payload: conversation,
        });
        setMessages([...messages, toolMessage, assistantMessage]);
      }
    } catch (e) {
      if (!abortController.signal.aborted) {
        let errorMessage =
          "An error occurred. Please try again. If the problem persists, please contact the site administrator.";
        if (result.error?.message) {
          errorMessage = result.error.message;
        } else if (typeof result.error === "string") {
          errorMessage = result.error;
        }
        let errorChatMsg: ChatMessage = {
          id: uuid(),
          role: ERROR,
          content: errorMessage,
          date: new Date().toISOString(),
        };
        conversation.messages.push(errorChatMsg);
        appStateContext?.dispatch({
          type: "UPDATE_CURRENT_CHAT",
          payload: conversation,
        });
        setMessages([...messages, errorChatMsg]);
      } else {
        setMessages([...messages, userMessage]);
      }
    } finally {
      setIsLoading(false);
      setShowLoadingMessage(false);
      abortFuncs.current = abortFuncs.current.filter(
        (a) => a !== abortController
      );
      setProcessMessages(messageStatus.Done);
    }

    return abortController.abort();
  };

  const makeApiRequestWithCosmosDB = async (
    question: string,
    conversationId?: string
  ) => {
    setIsLoading(true);
    setShowLoadingMessage(true);
    const abortController = new AbortController();
    abortFuncs.current.unshift(abortController);

    const userMessage: ChatMessage = {
      id: uuid(),
      role: "user",
      content: question,
      date: new Date().toISOString(),
    };

    //api call params set here (generate)
    let request: ConversationRequest;
    let conversation;
    if (conversationId) {
      conversation = appStateContext?.state?.chatHistory?.find(
        (conv) => conv.id === conversationId
      );
      if (!conversation) {
        console.error("Conversation not found.");
        setIsLoading(false);
        setShowLoadingMessage(false);
        abortFuncs.current = abortFuncs.current.filter(
          (a) => a !== abortController
        );
        return;
      } else {
        conversation.messages.push(userMessage);
        request = {
          messages: [
            ...conversation.messages.filter((answer) => answer.role !== ERROR),
          ],
        };
      }
    } else {
      request = {
        messages: [userMessage].filter((answer) => answer.role !== ERROR),
      };
      setMessages(request.messages);
    }
    let result = {} as ChatResponse;
    try {
      const response = conversationId
        ? await historyGenerate(request, abortController.signal, conversationId)
        : await historyGenerate(request, abortController.signal);
      if (!response?.ok) {
        const responseJson = await response.json();
        var errorResponseMessage =
          responseJson.error === undefined
            ? "Please try again. If the problem persists, please contact the site administrator."
            : responseJson.error;
        let errorChatMsg: ChatMessage = {
          id: uuid(),
          role: ERROR,
          content: `There was an error generating a response. Chat history can't be saved at this time. ${errorResponseMessage}`,
          date: new Date().toISOString(),
        };
        let resultConversation;
        if (conversationId) {
          resultConversation = appStateContext?.state?.chatHistory?.find(
            (conv) => conv.id === conversationId
          );
          if (!resultConversation) {
            console.error("Conversation not found.");
            setIsLoading(false);
            setShowLoadingMessage(false);
            abortFuncs.current = abortFuncs.current.filter(
              (a) => a !== abortController
            );
            return;
          }
          resultConversation.messages.push(errorChatMsg);
        } else {
          setMessages([...messages, userMessage, errorChatMsg]);
          setIsLoading(false);
          setShowLoadingMessage(false);
          abortFuncs.current = abortFuncs.current.filter(
            (a) => a !== abortController
          );
          return;
        }
        appStateContext?.dispatch({
          type: "UPDATE_CURRENT_CHAT",
          payload: resultConversation,
        });
        setMessages([...resultConversation.messages]);
        return;
      }
      if (response?.body) {
        const reader = response.body.getReader();

        let runningText = "";
        while (true) {
          setProcessMessages(messageStatus.Processing);
          const { done, value } = await reader.read();
          if (done) break;

          var text = new TextDecoder("utf-8").decode(value);
          const objects = text.split("\n");
          objects.forEach((obj) => {
            try {
              if (obj !== "" && obj !== "{}") {
                runningText += obj;
                result = JSON.parse(runningText);
                if (!result.choices?.[0]?.messages?.[0].content) {
                  errorResponseMessage = NO_CONTENT_ERROR;
                  throw Error();
                }
                if (result.choices?.length > 0) {
                  result.choices[0].messages.forEach((msg) => {
                    msg.id = result.id;
                    msg.date = new Date().toISOString();
                  });
                  if (
                    result.choices[0].messages?.some(
                      (m) => m.role === ASSISTANT
                    )
                  ) {
                    setShowLoadingMessage(false);
                  }
                  result.choices[0].messages.forEach((resultObj) => {
                    processResultMessage(
                      resultObj,
                      userMessage,
                      conversationId
                    );
                  });
                }
                runningText = "";
              } else if (result.error) {
                throw Error(result.error);
              }
            } catch (e) {
              if (!(e instanceof SyntaxError)) {
                console.error(e);
                throw e;
              } else {
                console.log("Incomplete message. Continuing...");
              }
            }
          });
        }

        let resultConversation;
        if (conversationId) {
          resultConversation = appStateContext?.state?.chatHistory?.find(
            (conv) => conv.id === conversationId
          );
          if (!resultConversation) {
            console.error("Conversation not found.");
            setIsLoading(false);
            setShowLoadingMessage(false);
            abortFuncs.current = abortFuncs.current.filter(
              (a) => a !== abortController
            );
            return;
          }
          isEmpty(toolMessage)
            ? resultConversation.messages.push(assistantMessage)
            : resultConversation.messages.push(toolMessage, assistantMessage);
        } else {
          resultConversation = {
            id: result.history_metadata.conversation_id,
            title: result.history_metadata.title,
            messages: [userMessage],
            date: result.history_metadata.date,
          };
          isEmpty(toolMessage)
            ? resultConversation.messages.push(assistantMessage)
            : resultConversation.messages.push(toolMessage, assistantMessage);
        }
        if (!resultConversation) {
          setIsLoading(false);
          setShowLoadingMessage(false);
          abortFuncs.current = abortFuncs.current.filter(
            (a) => a !== abortController
          );
          return;
        }
        appStateContext?.dispatch({
          type: "UPDATE_CURRENT_CHAT",
          payload: resultConversation,
        });
        isEmpty(toolMessage)
          ? setMessages([...messages, assistantMessage])
          : setMessages([...messages, toolMessage, assistantMessage]);
      }
    } catch (e) {
      if (!abortController.signal.aborted) {
        let errorMessage = `An error occurred. ${errorResponseMessage}`;
        if (result.error?.message) {
          errorMessage = result.error.message;
        } else if (typeof result.error === "string") {
          errorMessage = result.error;
        }
        let errorChatMsg: ChatMessage = {
          id: uuid(),
          role: ERROR,
          content: errorMessage,
          date: new Date().toISOString(),
        };
        let resultConversation;
        if (conversationId) {
          resultConversation = appStateContext?.state?.chatHistory?.find(
            (conv) => conv.id === conversationId
          );
          if (!resultConversation) {
            console.error("Conversation not found.");
            setIsLoading(false);
            setShowLoadingMessage(false);
            abortFuncs.current = abortFuncs.current.filter(
              (a) => a !== abortController
            );
            return;
          }
          resultConversation.messages.push(errorChatMsg);
        } else {
          if (!result.history_metadata) {
            console.error("Error retrieving data.", result);
            let errorChatMsg: ChatMessage = {
              id: uuid(),
              role: ERROR,
              content: errorMessage,
              date: new Date().toISOString(),
            };
            setMessages([...messages, userMessage, errorChatMsg]);
            setIsLoading(false);
            setShowLoadingMessage(false);
            abortFuncs.current = abortFuncs.current.filter(
              (a) => a !== abortController
            );
            return;
          }
          resultConversation = {
            id: result.history_metadata.conversation_id,
            title: result.history_metadata.title,
            messages: [userMessage],
            date: result.history_metadata.date,
          };
          resultConversation.messages.push(errorChatMsg);
        }
        if (!resultConversation) {
          setIsLoading(false);
          setShowLoadingMessage(false);
          abortFuncs.current = abortFuncs.current.filter(
            (a) => a !== abortController
          );
          return;
        }
        appStateContext?.dispatch({
          type: "UPDATE_CURRENT_CHAT",
          payload: resultConversation,
        });
        setMessages([...messages, errorChatMsg]);
      } else {
        setMessages([...messages, userMessage]);
      }
    } finally {
      setIsLoading(false);
      setShowLoadingMessage(false);
      abortFuncs.current = abortFuncs.current.filter(
        (a) => a !== abortController
      );
      setProcessMessages(messageStatus.Done);
    }
    return abortController.abort();
  };

  return (
    <QuestionInput
      clearOnSend
      placeholder="Type a new question..."
      disabled={chatStateContext?.state.isLoading ?? false}
      onSend={(question, id) => {
        appStateContext?.state.isCosmosDBAvailable?.cosmosDB
          ? makeApiRequestWithCosmosDB(question, id)
          : makeApiRequestWithoutCosmosDB(question, id);
      }}
      conversationId={
        appStateContext?.state.currentChat?.id
          ? appStateContext?.state.currentChat?.id
          : undefined
      }
    />
  );
};

export default ChatQuestionInput;

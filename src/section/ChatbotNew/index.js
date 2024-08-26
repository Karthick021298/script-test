import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import BotModal from "./BotModal";
import useAuth from "../../Utils/Hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import ReconnectingWebSocket from "reconnecting-websocket";
import secureLocalStorage from "react-secure-storage";
import BotApi from "@/service/BotApi";
import moment from "moment";
import _ from "lodash";
import { decryption } from "@/Utils/Aes";
import { API_ENDPOINTS } from "@/Constants";
function Chatbot() {
  const [isHovered, setIsHovered] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showDivs, setShowDivs] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dynamicTab, setDynamicTab] = useState("Chat");
  const [tabOrder, setTabOrder] = useState(0);
  const [onlineStatus, setOnlinestatus] = useState(false);
  const [sendMsg, setSendMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [availSlot, setAvailslot] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageLoader, setMessageLoader] = useState(false);
  const [appointmentList, setAppointmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatinMsg, setGeneratingMsg] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const [doctorsList, setDoctorsList] = useState([]);
  const [disableFAQ, setDisableFAQ] = useState(false);
  useEffect(() => {
    !messageLoader && setMessageLength(messages?.length);
  }, [messages, messageLoader]);
  useEffect(() => {
    setTimeout(() => {
      setShowButton(true);
      setTimeout(() => {
        setShowDivs(true);
      }, 500);
    }, 2000);

    const isCardClosed = localStorage.getItem("isCardClosed");
    setShowCard(isCardClosed !== "true");
  }, []);
  const toggleModal = () => {
    setShowModal(!showModal);
    localStorage.setItem("typoStop", !showModal);
  };
  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        ease: "easeOut",
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        yoyo: Infinity,
        duration: 0.3,
      },
    },
  };
  const divVariants = {
    hidden: { scale: 0.1 },
    visible: { scale: 1 },
    hover: { scale: 1.1 },
  };
  const {
    token,
    custName,
    domainData,
    bot_custUuid,
    bot_cheadId,
    botNum,
    groupName,
    socket,
    setSocket,
    custUuid,
    setSelectionMode,
    botSessionId,
    setBotSessionId,
    setJsonFetch,
  } = useAuth();
  const [currentState, setCurrentState] = useState([]);
  let parsedData;
  function convertToJSON(input) {
    try {
      parsedData = JSON.parse(input);
    } catch (e) {
      parsedData = input;
    }
  }
  useEffect(() => {
    console.log("getDoctorsListgetDoctorsList");
    !_.isEmpty(domainData?.mastTentUuid) &&
      BotApi.getDoctorsList(domainData?.mastTentUuid).then(
        (res) => setDoctorsList(res),
        (err) => setDoctorsList([])
      );
  }, [domainData]);
  const processChunk = (chunk, messageId) => {
    try {
      if (chunk !== "null") {
        convertToJSON(chunk);
        let newItem;
        let intent = parsedData?.intent;
        if (_.isEqual(intent, "doctor_list")) {
          newItem = {
            name: "list",
            type: "bot",
            ai_generated: true,
            jsonType: "nonCard",
            component: "",
            message_id: messageId,
            doctorData: doctorsList,
            data: {
              message: parsedData?.response,
            },
            isFromSocket: true,
            is: false,
            isNotRecommended: false,
          };
        } else {
          newItem = {
            name: "WelcomeMessages",
            type: "bot",
            ai_generated: true,
            jsonType: "card",
            component: "",
            message_id: messageId,
            data: {
              message: parsedData,
            },
            isFromSocket: true,
            is: false,
            isNotRecommended: false,
          };
        }
        setMessages((prevState) => {
          const updatedArray = [...prevState.slice(0, -1)];
          updatedArray.push(newItem);
          return updatedArray;
        });
        setLoading(false);
        setDisableFAQ(false);
      }
    } catch (err) {
      setGeneratingMsg(false);
      setDisableFAQ(false);
    }
  };
  const fetchData = async (body, msgList, timeout = 30000) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setGeneratingMsg(false);
      setDisableFAQ(false);
      setMessages((prevState) => {
        const updatedArray = [
          ...prevState.slice(0, -1),
          {
            name: "WelcomeMessages",
            type: "bot",
            ai_generated: true,
            jsonType: "card",
            component: "",
            message_id: uuidv4(),
            data: {
              message:
                "I’m sorry, but I’m having trouble understanding your request. Please try again in a moment.",
            },
            isFromSocket: true,
            is: false,
            isNotRecommended: false,
          },
        ];
        return updatedArray;
      });
      controller.abort();
    }, timeout);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BOT_URL}/${API_ENDPOINTS.CHAT_SEND_MSG}/${domainData?.mastTentUuid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal,
        }
      );
      clearTimeout(timeoutId);
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      setGeneratingMsg(true);
      const messageId = uuidv4();
      let partialData = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setGeneratingMsg(false);
          setDisableFAQ(false);
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        partialData = partialData + chunk;
        processChunk(partialData, messageId);
      }
      let strObj = JSON.stringify({
        action: "message",
        message_id: messageId,
        message: JSON.stringify(partialData),
        thumbs_up: false,
        thumbs_down: false,
        sender: "ai",
      });
      socket.send(strObj);
    } catch (err) {
      setLoading(false);
      setGeneratingMsg(false);
      setDisableFAQ(false);
      setMessages((prevState) => {
        const updatedArray = [
          ...prevState.slice(0, -1),
          {
            name: "WelcomeMessages",
            type: "bot",
            ai_generated: true,
            jsonType: "card",
            component: "",
            message_id: uuidv4(),
            data: {
              message:
                "I’m sorry, but I’m having trouble understanding your request. Please try again in a moment.",
            },
            isFromSocket: true,
            is: false,
            isNotRecommended: false,
          },
        ];
        return updatedArray;
      });
    }
  };
  const deliverMsg = async (msg, refId) => {
    if (msg !== "") {
      const messageId = uuidv4();
      setLoading(true);
      setDisableFAQ(true);
      setMessages((prevState) => [
        ...prevState,
        {
          name: "WelcomeMessages",
          type: "cust",
          message_id: messageId,
          jsonType: "card",
          component: "",
          data: {
            message: msg,
          },
        },
        {
          name: "loader",
          type: "bot",
          jsonType: "NonCard",
          component: "",
          data: {
            message: "",
          },
        },
      ]);
      const body = {
        text: msg,
        refId: refId ? refId : botSessionId,
      };

      if (socket && msg) {
        let strObj = JSON.stringify({
          action: "message",
          message: msg,
          message_id: messageId,
          thumbs_up: false,
          thumbs_down: false,
          sender: "cust",
        });
        await socket?.send(strObj);
      }
      setSendMsg("");
      fetchData(body, messages);
    }
  };
  const createSessionId = () => {
    const data = {
      session_id: uuidv4(),
      cust_id: bot_custUuid || custUuid,
      mast_tent_uuid: domainData?.mastTentUuid,
    };
    BotApi.createChatSession(data).then(
      async (res) => {
        setBotSessionId(data?.session_id);
        secureLocalStorage.setItem("botSessionId", data?.session_id);
      },
      (err) => console.log("errr", err)
    );
  };
  const createSessionIdMsg = (text) => {
    const data = {
      session_id: uuidv4(),
      cust_id: bot_custUuid || custUuid,
      mast_tent_uuid: domainData?.mastTentUuid,
    };
    BotApi.createChatSession(data).then(
      async (res) => {
        setBotSessionId(data?.session_id);
        secureLocalStorage.setItem("botSessionId", data?.session_id);
        deliverMsg(text, data?.session_id);
      },
      (err) => console.log("errr", err)
    );
  };
  useEffect(() => {
    if (botSessionId) {
      const ws = new ReconnectingWebSocket(
        `${process.env.NEXT_PUBLIC_CHATBOT_SOCKET}/${botSessionId}`
      );
      ws.debug = true;
      ws.timeoutInterval = 3000;
      ws.maxRetries = 4;
      ws.onopen = (event) => {
        setOnlinestatus(true);
        console.log("Websocket connected");
      };
      ws.onerror = function (error) {
        ws.onclose = (event) => {
          setOnlinestatus(false);
        };
      };
      ws.onclose = (event) => {
        setOnlinestatus(false);
      };
      setSocket(ws);
      secureLocalStorage.setItem("socketstatus", ws);
      return () => {
        if (socket) {
          ws.close();
          setSocket(null);
        }
      };
    }
  }, [botSessionId]);
  useEffect(() => {
    const onSuccess = (res) => {
      const successData = decryption(res);
      let data = successData?.data?.tentUserServiceDTO;
      if (successData?.status === "success") {
        let temp = _.find(
          data,
          (item) => item?.tentUserDTO?.tentUserUuid === userData?.tent_user_uuid
        );
        setSelectedUser(temp);
      }
    };
    const onFailure = (err) => {
      console.log(err);
    };
    !_.isEmpty(domainData?.mastTentUuid) &&
      BotApi.GetTentUsersListDetails(domainData?.mastTentUuid, {
        getSpecialist: "All Specialists",
        userName: "",
        getFacility: "All Specialists",
      }).then(onSuccess, onFailure);
  }, [domainData?.mastTentUuid, userData?.tent_user_uuid]);
  const [params, setParams] = useState(null);
  useEffect(() => {
    !_.isEmpty(params?.appointmentMode) &&
      BotApi.getSlot({
        ...params,
      }).then(
        (res) => {
          if (res?.data?.status === "success") {
            setAvailslot(res?.data?.data);
            addModes(params?.appointmentMode, res?.data?.data);
          }
        },
        (err) => setAvailslot([])
      );
  }, [params]);
  useEffect(() => {
    if (domainData?.mastTentUuid && (custUuid || bot_custUuid)) {
      BotApi.getAppointmentsList({
        tentId: domainData?.mastTentUuid,
        custId: custUuid || bot_custUuid,
        period: "upcoming",
      }).then(
        (res) => setAppointmentList(res?.data?.data),
        (err) => setAppointmentList([])
      );
    }
  }, [domainData?.mastTentUuid, custUuid, bot_custUuid]);
  const sendChatMsg = (textMsg) => {
    if (botSessionId) {
      deliverMsg(textMsg, botSessionId, socket);
    } else {
      createSessionIdMsg(textMsg);
    }
  };
  const addModes = (item, data) => {
    setUserData((prevState) => ({
      ...prevState,
      appointmentMode: item,
    }));
    if (!_.isEmpty(data)) {
      setMessages((prevState) => [
        ...prevState,
        {
          name: "appointmentMode",
          type: "cust",
          jsonType: "card",
          component: "",
          data: {
            message: _.isEqual(item, "at-clinic")
              ? "In-person"
              : _.isEqual(item, "at-home")
              ? "Home"
              : "Online",
          },
        },
        {
          name: "TimeSlotView",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message: "Select the time",
          },
        },
        {
          name: "SlotSelection",
          type: "bot",
          disabled: false,
          jsonType: "NonCard",
          component: data,
          data: {},
        },
      ]);
    }
  };
  const showSpecialist = () => {
    setCurrentState((prevState) => [
      {
        ...prevState[0],
        ChooseChatOption: {
          ...prevState[0]?.ChooseChatOption,
          findSpecialist: true,
        },
      },
    ]);
    setMessages((prevState) => [
      ...prevState,
      {
        name: "Book-demo",
        type: "cust",
        jsonType: "card",
        component: "",
        data: {
          message: "Find a specialist",
        },
      },
      {
        name: "choose-specialist",
        type: "bot",
        jsonType: "card",
        component: "choose specialist",
        data: {
          message: "",
        },
      },
    ]);
  };
  const showAppointments = () => {
    if (_.isEmpty(userData?.appointment_details)) {
      setMessages((prevState) => [
        ...prevState,
        {
          name: "appointment_list",
          type: "bot",
          jsonType: "NonCard",
          component: "",
          data: {
            message: "You don`t have any appointments scheduled",
          },
        },
      ]);
    } else {
      setMessages((prevState) => [
        ...prevState,
        {
          name: "appointment_list",
          type: "bot",
          jsonType: "NonCard",
          component: "",
          data: {
            message: "Here are your upcoming appointments",
          },
        },
        {
          name: "appointment_list",
          type: "bot",
          disabled: false,
          jsonType: "NonCard",
          component: "",
          data: {},
        },
      ]);
    }
  };
  const nextStepCase = (key, json) => {
    switch (key) {
      case "select_mode":
        return setMessages((prevState) => [
          ...prevState,
          {
            name: "ChosenDate",
            type: "cust",
            jsonType: "card",
            messageId: uuidv4(),
            component: "",
            data: {
              message: moment(json?.date, "YYYY-MM-DD").format("DD MMM YYYY"),
            },
          },
          {
            name: "Choose branch",
            type: "bot",
            jsonType: "card",
            messageId: uuidv4(),
            component: "",
            data: {
              message: "Choose the mode of appointment",
            },
          },
          {
            name: "actions",
            type: "bot",
            jsonType: "",
            component: "",
            data: _.map(json?.available_modes, (item) => {
              return {
                actionName: _.isEqual(item, "at-clinic")
                  ? "In-person"
                  : _.isEqual(item, "at-home")
                  ? "Home"
                  : "Online",
                id: _.isEqual(item, "at-clinic")
                  ? "inperson"
                  : _.isEqual(item, "at-home")
                  ? "home"
                  : "online",
                onPress: () => {
                  setParams((prevState) => ({
                    ...prevState,
                    appointmentMode: item,
                  }));
                },
              };
            }),
          },
        ]);
      case "select_date":
        return setMessages((prevState) => [
          ...prevState,
          {
            name: "DateSelection",
            type: "bot",
            jsonType: "card",
            component: "DateSelection",
            messageId: uuidv4(),
            data: {
              message: "Please choose the appointment date",
            },
          },
          {
            name: "DateSelection",
            type: "bot",
            jsonType: "NonCard",
            component: "",
            data: {},
          },
        ]);
      case "select_time":
        return setMessages((prevState) => [
          ...prevState,
          {
            name: "TimeSlotView",
            type: "bot",
            jsonType: "card",
            component: "",
            messageId: uuidv4(),
            data: {
              message: "Select the time",
            },
          },
          {
            name: "SlotSelection",
            disabled: false,
            type: "bot",
            jsonType: "NonCard",
            component: availSlot,
            data: {},
          },
        ]);
      case "reschedule_appointment":
        return setMessages((prevState) => [
          ...prevState,
          {
            name: "Default msg",
            type: "bot",
            jsonType: "card",
            component: "",
            messageId: uuidv4(),
            data: {
              message: "Choose an appointment to reschedule",
            },
          },
          {
            name: "appointment_list",
            type: "bot",
            disabled: false,
            jsonType: "NonCard",
            component: "",
            data: {},
          },
        ]);
      case "cancel_appointment":
        return setMessages((prevState) => [
          ...prevState,
          {
            name: "Default msg",
            type: "bot",
            jsonType: "card",
            component: "",
            messageId: uuidv4(),
            data: {
              message: "Choose an appointment to cancel",
            },
          },
          {
            name: "appointment_list",
            type: "bot",
            disabled: false,
            jsonType: "NonCard",
            component: "",
            data: {},
          },
        ]);
      case "get_appointment":
        return showAppointments();
      default:
        return setMessages((prevState) => [
          ...prevState,
          {
            name: "Book-demo",
            type: "bot",
            jsonType: "card",
            component: "",
            messageId: uuidv4(),
            data: {
              message: "Please choose a specialist",
            },
          },
          {
            name: "actions",
            type: "bot",
            jsonType: "",
            component: "",
            disabled: false,
            data: [
              {
                actionName: "Find a specialist",
                id: "find_specialist",
                onPress: () => showSpecialist(),
              },
            ],
          },
        ]);
    }
  };

  // Receive message
  useEffect(() => {
    if (socket) {
      socket.onmessage = function (event) {
        let botCust =
          secureLocalStorage.getItem("bot_custUuid") ||
          secureLocalStorage.getItem("custUuid");
        const json = JSON.parse(event?.data);
        setParams((prevState) => ({
          ...prevState,
          tentId: json?.mast_tent_uuid,
          appointmentMode: json?.mode,
          scheduledOn: json?.date,
          tentUserId: json?.tent_user_uuid,
        }));
        setUserData(json);
        const key = json?.endpoint;
        setSelectionMode(key);
        setJsonFetch(json);
        setMessages((prevState) => {
          const updatedArray = [...prevState.slice(0, -1)];
          return updatedArray;
        });
        try {
          setLoading(false);
          if (_.isEmpty(botCust)) {
            setMessages((prevState) => [
              ...prevState,
              {
                name: "WelcomeMessages",
                type: "bot",
                jsonType: "card",
                messageId: uuidv4(),
                component: "",
                data: {
                  message:
                    "Please login with your credentials to proceed further",
                },
              },
              {
                name: "NameMobileForm",
                type: "bot",
                jsonType: "card",
                component: "",
                data: {},
              },
            ]);
          } else {
            nextStepCase(key, json);
          }
        } catch (err) {
          console.log(err);
        }
      };
    }
  }, [botSessionId, showModal, socket, availSlot]);

  useEffect(() => {
    if (!_.isEmpty(messages)) {
      const chatState = { messages: messages };
      localStorage.setItem("chatState", JSON.stringify(chatState));
    }
  }, [messages]);
  useEffect(() => {
    if (token !== null) {
      setMessages([]);
    }
  }, [token]);
  useEffect(() => {
    if (custName === null) {
      setMessages([]);
    }
  }, [custName]);
  const onClickBot = () => {
    setShowModal(true);
    createSessionId();
  };
  return (
    <>
      {showButton && (
        <motion.button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: 0,
            width: 68,
            height: 68,
            background: "linear-gradient(180deg, #0062DD, #2EB2FF)",
            borderRadius: "50%",
            padding: "12px",
            position: "fixed",
            bottom: "64px",
            right: "30px",
            cursor: "pointer",
          }}
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onClick={() => onClickBot()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          id="chatbot_dialog"
        >
          {showDivs && (
            <>
              <motion.div
                style={{
                  width: 16,
                  height: 16,
                  background: "linear-gradient(180deg, #0062DD, #2EB2FF)",
                  borderRadius: "50%",
                  position: "absolute",
                  bottom: "56px",
                  right: "-8px",
                }}
                variants={divVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              />
              <motion.div
                style={{
                  width: 7,
                  height: 7,
                  background: "linear-gradient(180deg, #0062DD, #2EB2FF)",
                  borderRadius: "50%",
                  position: "absolute",
                  bottom: "70px",
                  right: "-14px",
                }}
                variants={divVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              />
            </>
          )}
          <Image
            src={`${process?.env?.NEXT_PUBLIC_IMAGEKIT_URL}/Microsite/Floating_icon.svg`}
            alt="micro-bot"
            width={40}
            height={40}
          />
        </motion.button>
      )}

      {showModal && (
        <BotModal
          toggleModal={toggleModal}
          showModal={showModal}
          domainData={domainData}
          groupName={groupName}
          botNum={botNum}
          bot_custUuid={bot_custUuid}
          bot_cheadId={bot_cheadId}
          dynamicTab={dynamicTab}
          setDynamicTab={setDynamicTab}
          tabOrder={tabOrder}
          setTabOrder={setTabOrder}
          onlineStatus={onlineStatus}
          sendMsg={sendMsg}
          sendChatMsg={(msg) => sendChatMsg(msg)}
          setOnlinestatus={setOnlinestatus}
          setSendMsg={setSendMsg}
          messages={messages}
          setMessages={setMessages}
          setCurrentState={setCurrentState}
          currentState={currentState}
          availSlot={availSlot}
          setAvailslot={setAvailslot}
          userData={userData}
          socket={socket}
          setUserData={setUserData}
          selectedUser={selectedUser}
          nextStepCase={nextStepCase}
          messageLoader={loading}
          generatingMsg={generatinMsg}
          setGeneratingMsg={setGeneratingMsg}
          disableFAQ={disableFAQ}
          setParams={setParams}
          params={params}
          doctorsList={doctorsList}
          appointmentList={appointmentList}
        />
      )}
    </>
  );
}

export default Chatbot;

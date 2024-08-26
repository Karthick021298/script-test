import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { IconButton, makeStyles } from "@material-ui/core";
import { Avatar, Button, Grid, Link, Typography } from "@mui/material";
import CustFormdata from "./JsonUI/CustFormdata";
import ChatOptions from "./JsonUI/ChatOptions";
import { themeConfig } from "@/theme/themesConfig";
import DateSelection from "./JsonUI/DateSelection";
import _, { split } from "lodash";
import TimeSlot from "./JsonUI/TimeSlot";
import BotApi from "@/service/BotApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PropagateLoader, PulseLoader, SyncLoader } from "react-spinners";
import secureLocalStorage from "react-secure-storage";
import ActionOptions from "./JsonUI/ActionOptions";
import ChooseSpecialist from "./JsonUI/ChooseSpecialist";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import AppointmentList from "./JsonUI/AppointmentList";
import FAQ from "./JsonUI/FAQ";
import { v4 as uuidv4 } from "uuid";
import Feedback from "./JsonUI/Feedback";
import ListUI from "./JsonUI/ListUI";
import Lottie from "react-lottie";
import messageLoader from "../../../../LottieFiles/messageLoader.json";
import { isYandex } from "react-device-detect";
import useAuth from "@/Utils/Hooks/useAuth";
import { decryption } from "@/Utils/Aes";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "inline-flex",
    padding: "8px",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: "10px",
    background: "#ECEEF5",
    maxWidth: "90%",
    "& .MuiTypography-h3": {
      fontSize: themeConfig.typography.h3.fontSize,
      fontFamily: themeConfig.typography.h3.fontFamily,
      fontWeight: 500,
      whiteSpace: "pre-line",
      lineHeight: "18px",
    },
  },
  formCard: {
    display: "inline-flex",
    padding: "8px",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    width: "70%",
    borderRadius: "10px",
    background: "#FFF",
    border: "2px solid #D9D9D9",
    "& .MuiTypography-h3": {
      fontSize: themeConfig.typography.h3.fontSize,
      fontFamily: themeConfig.typography.h3.fontFamily,
      fontWeight: 500,
      whiteSpace: "pre-line",
      lineHeight: "18px",
    },
  },
  conditionalCard: {
    display: "inline-flex",
    padding: "8px",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: "10px",
    background: themeConfig?.palette.lyfngo.primary.main,
    maxWidth: 280,
    "& .MuiTypography-h3": {
      fontSize: themeConfig.typography.h3.fontSize,
      fontFamily: themeConfig.typography.h3.fontFamily,
      fontWeight: 500,
      color: "#fff",
      lineHeight: "18px",
    },
  },
  messageContainer: {
    padding: "24px 18px",
    borderWidth: 3,
  },
  dots: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#ECEEF5",
    margin: "0 4px",
  },
  textContainer: {
    display: "flex",
    gap: 4,
    marginBottom: 12,
    "&. MuiAvatar-img": {
      width: "20px",
      height: "20px",
    },
  },
  restBtn: {
    display: "flex",
    justifyContent: "center",
    "&.MuiButtonBase-root": {
      border: `1px solid ${themeConfig?.palette?.lyfngo?.primary?.main}`,
      color: themeConfig?.palette?.lyfngo?.primary?.main || "#cccccc",
      textTransform: "capitalize",
      fontFamily: "poppins",
      display: "flex",
      fontSize: 11,
      padding: 0,
      width: "70px",
      [theme.breakpoints.down("xs")]: {
        fontSize: 11,
      },
      alignItems: "center",
      gap: "4px",
      borderRadius: 20,
      "&:hover": {
        background: themeConfig?.palette?.lyfngo?.primary?.main,
        color: themeConfig?.palette?.lyfngo?.light?.main,
        transition: ".5s ease",
      },
    },
  },
  avatar: {
    height: "20px",
    width: "20px",
  },
  upIcon: {
    "& .MuiIconButton-root": {
      padding: 6,
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: "#11be56",
      },
    },
  },
  disabled: {
    "& .MuiIconButton-root": {
      padding: 6,
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: "#c2c2c2",
      },
    },
  },
  downIcon: {
    "& .MuiIconButton-root": {
      padding: 6,
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: "#E22C34",
      },
    },
  },
  slider: {
    position: "relative",
    width: 340,
    paddingTop: 15,
    paddingBottom: 10,
    paddingInline: 15,
    borderRadius: 10,
    "& .MuiSvgIcon-root": {
      color: "#fff",
      width: 25,
      height: 25,
      background: themeConfig.palette.lyfngo.primary.main,
      borderRadius: 50,
      padding: 4,
      marginInline: -2,
    },
    "& .MuiTypography-root": {
      fontSize: 13,
      fontFamily: themeConfig.typography.h3.fontFamily,
      fontWeight: 400,
      color: "#000",
      textAlign: "left",
    },
    "& .slick-track": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    "& .slick-dots": {
      bottom: "-22px",
      width: "100%",
      margin: 0,
      textAlign: "center",
    },
    // '& .slick-dots li': {
    // 	margin: 0,
    // },
    "& .slideContainer": {
      display: "flex",
      flexDirection: "column",
      gap: 5,
    },
    "& .slick-prev:before": {
      display: "none",
    },
    "& .slick-next:before": {
      display: "none",
    },
    "& .slick-next": {
      right: -5,
    },
    "& .slick-list": {
      width: 470,
    },
  },
  slideContainer: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#ECEFFF",
    marginTop: 10,
    marginRight: 6,
    gap: 10,
    width: 200,
    height: 240,
    padding: 8,
    borderRadius: 10,
    cursor: "pointer",
    // transformStyle: 'preserve-3d',
    transition: "0.3s",
    // cursor: 'pointer',
    // '&:hover': {
    // 	transform: 'rotateY(180deg)',
    // },
  },
  slideContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // backfaceVisibility: 'hidden',
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ECEFFF",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    opacity: 0,
    padding: 8,
    borderRadius: 10,
    overflowY: "auto",
    scrollbarWidth: "thin",
    // transform: 'rotateY(180deg)',
  },
  cardHovered: {
    "&:hover $overlay": {
      opacity: 1,
    },
  },
}));

const ChatMessages = (props) => {
  const classes = useStyles();
  const {
    messages,
    setMessages,
    loading,
    setLoading,
    resetBot,
    setReset,
    currentState,
    setCurrentState,
    availSlot,
    setAvailslot,
    userData,
    setUserData,
    botSelectedUser,
    nextStepCase,
    sendChatMsg,
    socket,
    endChat,
    setEndCurrentChat,
    generatingMsg,
    setGeneratingMsg,
    disabled,
    setDisabled,
    disableFAQ,
    setParams,
    params,
    doctorsList,
    appointmentList,
  } = props;
  const {
    domainData,
    setBotName,
    setBotNum,
    setBotEmail,
    setBotSessionId,
    setReady,
    setBotCustId,
    bot_cheadId,
    setBotCheadId,
    aiSetStatus,
    setAICount,
    custName,
    token,
    custUuid,
    mobileNumber,
    country,
    setFaqList,
    setSelectionMode,
    setJsonFetch,
  } = useAuth();
  let botCust =
    secureLocalStorage.getItem("bot_custUuid") ||
    secureLocalStorage.getItem("custUuid");
  const initialMessages = [
    {
      name: "WelcomeMessages",
      type: "bot",
      jsonType: "card",
      messageId: uuidv4(),
      component: "",
      data: {
        message: `Welcome to ${domainData?.tentName}!`,
      },
    },
  ];
  const loggedMessages = [
    {
      name: "CustWelcome",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {
        message: `Hi, ${custName}`,
      },
    },
    {
      name: "tentWelcome",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {
        message: `Welcome to ${domainData?.tentName + "!"} 🏥`,
      },
    },
    {
      name: "chooseOptions",
      type: "bot",
      jsonType: "card",
      component: "",
      data: {
        message: `Please choose below option to continue`,
      },
    },
    {
      name: "ChooseChatOption",
      type: "bot",
      jsonType: "NonCard",
      component: "",
      data: {},
    },
  ];
  let intialValue = [
    {
      NameMobileForm: {
        name: "",
        mobile: "",
        country: "",
        email: "",
      },
      ChooseChatOption: {
        bookDemo: false,
        chatUs: false,
      },
      demoDate: "",
    },
  ];
  const [moblen, setMoblen] = useState(null);
  const [bookModes, setBookModes] = useState("");
  const numberOfUsersToShow = 3;
  const [currentIndex, setCurrentIndex] = useState(numberOfUsersToShow);
  const [tentUserList, setTentUserList] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [apptDetails, setApptDetails] = useState(null);
  useEffect(() => {
    setSelectedUser(botSelectedUser);
  }, [botSelectedUser]);
  const [defaultTentuser, setDefaultTentuser] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const bottomRef = useRef(null);
  const selectUser = (data) => {
    setUserData((prevState) => ({
      ...prevState,
      tentUserName: data?.tentUserDTO?.tentUserSalutation
        ? `${data?.tentUserDTO?.tentUserSalutation}. ${data?.tentUserDTO?.tentUserName}`
        : data?.tentUserDTO?.tentUserName,
    }));
    setCurrentState((prevState) => [
      {
        ...prevState[0],
        ChooseChatOption: {
          ...prevState[0]?.ChooseChatOption,
          selectUser: true,
        },
      },
    ]);
    setSelectedUser(data);
    setMessages((prevState) => [
      ...prevState,
      {
        name: "Book-demo",
        type: "cust",
        jsonType: "card",
        component: "",
        data: {
          message: `${data?.tentUserDTO?.tentUserSalutation}. ${data?.tentUserDTO?.tentUserName}`,
        },
      },
      {
        name: "DateSelection",
        type: "bot",
        jsonType: "card",
        component: "DateSelection",
        data: {
          message: "Please choose the appointment date",
        },
      },
      {
        name: "DateSelection",
        type: "bot",
        disabled: false,
        jsonType: "NonCard",
        component: "",
        data: {},
      },
    ]);
  };
  const loadMore = () => {
    const nextIndex = currentIndex + numberOfUsersToShow;
    setDefaultTentuser(tentUserList.slice(0, nextIndex));
    setCurrentIndex(nextIndex);
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    resetBot && resetChat();
  }, [resetBot]);
  const schema = yup.object().shape({
    name: yup.string().required("Please enter your name"),
    phoneNum: yup
      .string()
      .required("Please enter the mobile number")
      .matches(/^([1-9][0-9]*)?$/, "Please enter the valid mobile number"),
    // .min(moblen, `Mobile number should be minimum ${moblen} digits`)
    // .max(moblen, `Must be exactly ${moblen} digits`),
    email: yup.string().email("Invalid email address"),
    terms: yup.bool().oneOf([true], "Please accept the terms and conditions"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    const onSuccess = (res) => {
      if (res?.data?.status === "success") {
        const modeNameFilter = res?.data?.data[0];
        if (_.isEqual(modeNameFilter, "Home")) {
          setBookModes("at-home");
        } else if (_.isEqual(modeNameFilter, "In-person")) {
          setBookModes("at-clinic");
        } else if (_.isEqual(modeNameFilter, "Online")) {
          setBookModes("on-line");
        } else {
          setBookModes(null);
        }
      }
    };
    const onFailure = (err) => {
      setBookModes("");
    };
    BotApi.getBookingModes({ tentId: domainData?.mastTentUuid }).then(
      onSuccess,
      onFailure
    );
  }, [domainData?.mastTentUuid]);
  useEffect(() => {
    const onSuccess = (res) => {
      const successData = decryption(res);
      let data = successData?.data?.tentUserServiceDTO;
      setLoading(false);
      if (successData?.status === "success") {
        setDefaultTentuser(data?.slice(0, numberOfUsersToShow));
        setTentUserList(data);
      }
    };
    const onFailure = (err) => {
      console.log(err);
    };
    !_.isEmpty(bookModes) &&
      !_.isEmpty(domainData?.mastTentUuid) &&
      BotApi.GetTentUsersListDetails(domainData?.mastTentUuid, {
        getSpecialist: "All Specialists",
        userName: "",
        getFacility: "All Specialists",
      }).then(onSuccess, onFailure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookModes, domainData?.mastTentUuid]);

  useEffect(() => {
    if (messages && document.getElementById("msgChatBot")) {
      const element = document.getElementById("msgChatBot");
      element.scrollTop = element.scrollHeight;
      setMessages(messages);
    }
  }, [messages]);
  useEffect(() => {
    const localData =
      typeof window !== "undefined" ? localStorage.getItem("chatState") : null;
    const savedState = localData ? JSON.parse(localData, reviver) : null;
    const savedTime =
      typeof window !== "undefined"
        ? localStorage.getItem("chatStateTime")
        : null;
    const currentTime = new Date().getTime();
    const expirationTime = 2 * 60 * 60 * 1000;
    if (token !== null) {
      if (
        savedState &&
        !_.isEmpty(savedState?.messages) &&
        currentTime - savedTime <= expirationTime
      ) {
        setMessages(savedState?.messages);
      } else {
        const addInitialMessages = async () => {
          const initialMessagesToAdd = [];
          for (let i = 0; i < Math.min(loggedMessages.length, 5); i++) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            initialMessagesToAdd.push(loggedMessages[i]);
            setMessages((prevMessages) => [...prevMessages, loggedMessages[i]]);
          }
          const chatState = { messages: initialMessagesToAdd };
          localStorage.setItem(
            "chatState",
            JSON.stringify(chatState, replacer)
          );
        };
        _.isEmpty(savedState?.messages) && addInitialMessages();
      }
    } else {
      if (
        savedState &&
        !_.isEmpty(savedState?.messages) &&
        currentTime - savedTime <= expirationTime
      ) {
        setMessages(savedState?.messages);
      } else {
        const addInitialMessages = async () => {
          const initialMessagesToAdd = [];
          for (let i = 0; i < Math.min(initialMessages.length, 3); i++) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            initialMessagesToAdd.push(initialMessages[i]);
            setMessages((prevMessages) => [
              ...prevMessages,
              initialMessages[i],
            ]);
          }
          const chatState = { messages: initialMessagesToAdd };
          localStorage.setItem(
            "chatState",
            JSON.stringify(chatState, replacer)
          );
          localStorage.setItem("chatStateTime", currentTime);
        };
        addInitialMessages();
      }
    }
  }, [setMessages, token]);

  useEffect(() => {
    const localInitializedData =
      typeof window !== "undefined"
        ? localStorage.getItem("reinitialized")
        : null;
    const savedState = localInitializedData
      ? JSON.parse(localInitializedData)
      : null;
    const savedTime =
      typeof window !== "undefined"
        ? localStorage.getItem("chatStateTime")
        : null;
    const currentTime = new Date().getTime();
    const expirationTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    if (token !== null) {
      console.log("logged chats");
    } else {
      if (
        savedState &&
        !_.isEmpty(savedState) &&
        currentTime - savedTime <= expirationTime
      ) {
        setCurrentState(savedState);
      } else {
        setCurrentState(intialValue);
        localStorage.setItem("reinitialized", JSON.stringify(intialValue));
      }
    }
  }, [token]);

  const replacer = (key, value) => {
    if (key === "component" && typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };
  const reviver = (key, value) => {
    if (key === "component" && typeof value === "string") {
      return value;
    }
    return value;
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
        disabled: false,
        component: "choose specialist",
        data: {
          message: "",
        },
      },
    ]);
  };
  const onClickBookAppointment = (userName) => {
    const onSuccess = (res) => {
      let tentUser = _.find(
        tentUserList,
        (item) => item?.tentUserDTO?.tentUserUuid === res?.data?.data
      );
      setSelectedUser(tentUser);
      setSelectionMode("select_date");
      setJsonFetch({
        available_modes: [],
        cust_uuid: null,
        date: null,
        endpoint: "select_date",
        location: null,
        mast_tent_uuid: domainData?.mastTentUuid,
        mode: null,
        room_id: "",
        session_id: secureLocalStorage.getItem("botSessionId"),
        specaility_uuid: "",
        tent_user_uuid: res?.data?.data,
        time: null,
      });
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
              message: "Please login with your credentials to proceed further",
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
        setMessages((prevState) => [
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
      }
    };
    const onFailure = (err) => {
      console.log("er");
    };
    BotApi.getTentUserID({
      mast_tent_uuid: domainData?.mastTentUuid,
      tent_user_name: userName,
    }).then(onSuccess, onFailure);
  };
  const bookDemo = () => {
    aiSetStatus(false);
    secureLocalStorage.setItem("AIstatus", false);
    setAICount(0);
    secureLocalStorage.setItem("AIsentCount", 0);
    let botCust =
      secureLocalStorage.getItem("bot_custUuid") ||
      secureLocalStorage.getItem("custUuid");
    if (botCust !== null) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "Book-demo",
          type: "cust",
          jsonType: "card",
          component: "",
          data: {
            message: "Book Appointment",
          },
        },
        {
          name: "Book-demo",
          type: "bot",
          jsonType: "card",
          component: "",
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
      setCurrentState((prevState) => [
        {
          ...prevState[0],
          ChooseChatOption: {
            ...prevState[0]?.ChooseChatOption,
            bookDemo: true,
          },
        },
      ]);
    } else {
      setMessages((prevState) => [
        ...prevState,
        {
          name: "WelcomeMessages",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message: "Please login with your credentials to proceed further",
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
    }
  };

  const chatUs = (data, chead_id) => {
    setLoading(true);
    const onSuccess = () => {
      setLoading(false);
      setReady(true);
      secureLocalStorage.setItem("readystate", true);
      aiSetStatus(false);
      secureLocalStorage.setItem("AIstatus", false);
      setAICount(0);
      secureLocalStorage.setItem("AIsentCount", 0);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "ChatUs",
          type: "cust",
          jsonType: "card",
          component: "",
          data: {
            message: data,
          },
        },
        {
          name: "waitReqest",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message:
              "Request sent to the advisor, Please wait for the connection. Request valid upto 24hours.",
          },
        },
      ]);
    };
    const onFailure = () => {
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "RequestFailure",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message: "Internal Error. Try again or please try after sometime",
          },
        },
      ]);
    };
    if (chead_id !== null && token !== null) {
      BotApi.waitRequest(chead_id).then(onSuccess, onFailure);
    } else {
      bot_cheadId && BotApi.waitRequest(bot_cheadId).then(onSuccess, onFailure);
    }
  };

  const loggedInChead = (labelData) => {
    const body = {
      Name: custName,
      Phone: "+" + country?.mastLookupKey + mobileNumber,
      Type: "micro_bot",
      MastTentUuid: domainData?.mastTentUuid,
      custUuid: custUuid,
    };
    setLoading(true);
    const onSuccess = (res) => {
      secureLocalStorage.setItem("botName", custName);
      setBotName(custName);
      secureLocalStorage.setItem("botNum", mobileNumber);
      setBotNum(mobileNumber);
      secureLocalStorage.setItem("bot_custUuid", res?.data?.data?.cust_uuid);
      setBotCustId(res?.data?.data?.cust_uuid);
      localStorage.setItem("bot_cheadId", res?.data?.data?.chead_id);
      setBotCheadId(res?.data?.data?.chead_id);
      setLoading(false);
      chatUs(labelData, res?.data?.data?.chead_id);
    };
    const onFailure = (err) => {
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "CheadErr",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message: "Internal Error. Please try again.",
          },
        },
      ]);
    };
    custUuid && BotApi.getLeadDetails(body).then(onSuccess, onFailure);
  };

  const aiChat = () => {
    aiSetStatus(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        name: "Powered-AI",
        type: "cust",
        jsonType: "card",
        component: "",
        data: {
          message: "AI Q&A",
        },
      },
      {
        name: "bot_msg",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {
          message: "Welcome to Health AI by Kauvery Hospital!",
        },
      },
      {
        name: "bot_msg",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {
          message: `Discover Health Insights with Kauvery's AI Assistant!`,
        },
      },
      {
        name: "bot_msg",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {
          message: `How can I help you today!`,
        },
      },
    ]);
  };
  useEffect(() => {
    localStorage.setItem("reinitialized", JSON.stringify(currentState));
  }, [currentState]);
  useEffect(() => {
    setFaqList([
      {
        name: "Login",
        id: "signin",
        onClick: () => {
          setMessages((prevState) => [
            ...prevState,
            {
              name: "WelcomeMessages",
              type: "cust",
              jsonType: "card",
              component: "",
              data: {
                message: "Login",
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
        },
      },
      {
        name: "Book an appointment",
        id: "book_appointment",
        onClick: () => bookDemo(),
      },
      {
        name: "Ask questions!",
        id: "faq",
        onClick: () => {
          setMessages((prevState) => [
            ...prevState,
            {
              name: "messages",
              type: "bot",
              jsonType: "card",
              component: "",
              data: {
                message:
                  "Here are a few questions that might be relevant for you",
              },
            },
            {
              name: "FAQ",
              type: "bot",
              jsonType: "Noncard",
              component: "",
              data: {},
            },
          ]);
        },
      },
    ]);
  }, []);

  const resetChat = () => {
    messages?.length > 1 && setLoading(true);
    const onSuccess = () => {
      const currentTime = new Date().getTime();
      let defaultState = [
        {
          name: "WelcomeMessages",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message: `Welcome to ${domainData?.tentName}!`,
          },
        },
      ];
      const diffLogged = token !== null ? loggedMessages : defaultState;
      localStorage.setItem("chatState", diffLogged);
      setMessages(diffLogged);
      token !== null ? "persisted" : reset();
      localStorage.setItem("reinitialized", {
        NameMobileForm: {
          name: "",
          mobile: "",
          country: "",
        },
        ChooseChatOption: {
          bookDemo: false,
          chatUs: false,
        },
        demoDate: "",
      });
      setCurrentState({});
      setSelectedDate("");
      localStorage.setItem("chatStateTime", currentTime);
      secureLocalStorage.setItem("readystate", false);
      setReady(false);
      localStorage.setItem("bot_cheadId", null);
      setBotCheadId(null);
      secureLocalStorage.setItem("bot_custUuid", null);
      setBotCustId(null);
      secureLocalStorage.setItem("botName", null);
      setBotName(null);
      secureLocalStorage.setItem("botNum", null);
      setBotNum(null);
      secureLocalStorage.setItem("botEmail", null);
      setBotEmail(null);
      secureLocalStorage.setItem("botEmail", null);
      setBotEmail(null);
      secureLocalStorage.setItem("botSessionId", null);
      setBotSessionId(null);
      setReset(false);
      setGeneratingMsg(false);
      if (socket) {
        socket.close();
      }
      setEndCurrentChat(false);
      setLoading(false);
    };
    messages?.length > 1 && socket
      ? BotApi.resetChat(domainData?.mastTentUuid, {
          session_id: secureLocalStorage.getItem("botSessionId"),
        }).then(onSuccess, (err) => setLoading(false))
      : onSuccess();
  };
  useEffect(() => {
    reset({
      name: "",
      phoneNum: "",
      email: "",
    });
  }, [reset]);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: messageLoader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  function extractDoctorsArray(array, string) {
    const regex = /Dr\.\s?[A-Za-z\. ]+/g;
    const matches = string.match(regex);
    const namesInString = matches ? matches.map((match) => match.trim()) : [];

    const matchedDoctors = array?.filter((doctor) => {
      return namesInString.some((name) => {
        const nameParts = name.split(" ").slice(1); // Remove 'Dr.'
        return nameParts.every((part) => doctor.Name.includes(part));
      });
    });
    const uniqueMatchedDoctors = matchedDoctors?.filter(
      (doctor, index, self) =>
        index === self.findIndex((d) => d.Name === doctor.Name)
    );
    return uniqueMatchedDoctors;
  }

  return (
    <Grid
      container
      direction="column"
      className={classes.messageContainer}
      ref={bottomRef}
    >
      <React.Fragment>
        {messages?.map((cmp, index) => {
          if (cmp?.jsonType === "card") {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={classes.textContainer}
                style={{
                  flexDirection: cmp?.type !== "bot" ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  sizes="small"
                  className={classes.avatar}
                  style={{
                    display: cmp?.type !== "bot" ? "none" : "block",
                    width: 25,
                    height: 25,
                  }}
                  src={`${process?.env?.NEXT_PUBLIC_IMAGEKIT_URL}/Microsite/chatbot.png`}
                />
                <div
                  className={
                    _.isEqual(cmp?.name, "choose-specialist")
                      ? classes.specialist
                      : _.isEqual(cmp?.name, "NameMobileForm")
                      ? classes.formCard
                      : cmp?.type !== "bot"
                      ? classes.conditionalCard
                      : classes.card
                  }
                >
                  {_.isEqual(cmp?.name, "choose-specialist") ? (
                    <ChooseSpecialist
                      data={cmp}
                      userList={defaultTentuser}
                      totalCount={tentUserList.length}
                      loadMore={loadMore}
                      selectUser={selectUser}
                      currentState={currentState}
                      index={index}
                      messages={messages}
                      setMessages={setMessages}
                    />
                  ) : !_.isEmpty(cmp?.data) ? (
                    <MessageComponent
                      data={cmp?.data?.message}
                      cmp={cmp}
                      classes={classes}
                      index={index}
                      setMessages={setMessages}
                      messages={messages}
                      socket={socket}
                      generatingMsg={generatingMsg}
                    />
                  ) : _.isEqual(cmp?.name, "NameMobileForm") ? (
                    <CustFormdata
                      setMessages={setMessages}
                      currentState={currentState}
                      setCurrentState={setCurrentState}
                      setBotCheadId={setBotCheadId}
                      setBotCustId={setBotCustId}
                      moblen={moblen}
                      setMoblen={setMoblen}
                      register={register}
                      handleSubmit={handleSubmit}
                      errors={errors}
                      reset={reset}
                      loading={loading}
                      setLoading={setLoading}
                      nextStepCase={nextStepCase}
                    />
                  ) : _.isEqual(cmp?.name, "loader") && generatingMsg ? (
                    <PulseLoader
                      size={10}
                      color={themeConfig.palette.lyfngo.primary.main}
                    />
                  ) : null}
                </div>
              </motion.div>
            );
          } else {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={classes.textContainer}
                style={{
                  flexDirection: cmp?.type !== "bot" ? "row-reverse" : "row",
                }}
              >
                {_.isEqual(cmp?.name, "actions") ? (
                  <ActionOptions
                    actions={cmp?.data}
                    data={cmp}
                    index={index}
                    currentState={currentState}
                    messages={messages}
                    setMessages={setMessages}
                  />
                ) : _.isEqual(cmp?.name, "ChooseChatOption") ||
                  _.isEqual(cmp?.name, "AdvisorOption") ||
                  _.isEqual(cmp?.name, "Advisor-In-AI") ? (
                  <ChatOptions
                    bookDemo={() => bookDemo(index)}
                    chatUs={chatUs}
                    loggedInChead={loggedInChead}
                    currentState={currentState}
                    cmpName={cmp?.name}
                    aiChat={aiChat}
                  />
                ) : _.isEqual(cmp?.name, "DateSelection") ? (
                  <DateSelection
                    setMessages={setMessages}
                    defaultTentuser={selectedUser}
                    bookModes={bookModes}
                    availSlot={availSlot}
                    setAvailslot={setAvailslot}
                    domainData={domainData}
                    setCurrentState={setCurrentState}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setLoading={setLoading}
                    selectedUser={selectedUser}
                    userData={userData}
                    setUserData={setUserData}
                    apptDetails={apptDetails}
                    setApptDetails={setApptDetails}
                    setParams={setParams}
                    params={params}
                    messages={messages}
                    index={index}
                    data={cmp}
                  />
                ) : _.isEqual(cmp?.name, "SlotSelection") ? (
                  <TimeSlot
                    data={cmp}
                    setMessages={setMessages}
                    availSlot={availSlot}
                    bookModes={bookModes}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    domainData={domainData}
                    defaultTentuser={defaultTentuser}
                    setLoading={setLoading}
                    selectedUser={selectedUser}
                    currentState={currentState}
                    setCurrentState={setCurrentState}
                    userData={userData}
                    apptDetails={apptDetails}
                    endChat={endChat}
                    messages={messages}
                    index={index}
                  />
                ) : _.isEqual(cmp?.name, "appointment_list") ? (
                  <AppointmentList
                    setMessages={setMessages}
                    availSlot={availSlot}
                    bookModes={bookModes}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    domainData={domainData}
                    defaultTentuser={defaultTentuser}
                    selectedUser={selectedUser}
                    currentState={currentState}
                    setCurrentState={setCurrentState}
                    userData={userData}
                    apptDetails={apptDetails}
                    setApptDetails={setApptDetails}
                    setLoading={setLoading}
                    endChat={endChat}
                    appointmentList={appointmentList}
                    messages={messages}
                    index={index}
                    data={cmp}
                    setUserData={setUserData}
                  />
                ) : _.isEqual(cmp?.name, "feedback") ? (
                  <Feedback
                    setMessages={setMessages}
                    disabled={disabled}
                    setDisabled={setDisabled}
                  />
                ) : _.isEqual(cmp?.name, "loader") ? (
                  <div
                    style={{ display: "flex", gap: 4, alignItems: "center" }}
                  >
                    <Avatar
                      sizes="small"
                      style={{ width: 25, height: 25 }}
                      className={classes.avatar}
                      src={`${process?.env?.NEXT_PUBLIC_IMAGEKIT_URL}/Microsite/chatbot.png`}
                    />
                    <Lottie options={defaultOptions} height={60} width={70} />
                    {/* <SyncLoader size={8} color={themeConfig.palette.lyfngo.primary.main} speedMultiplier={0.5} /> */}
                  </div>
                ) : _.isEqual(cmp?.name, "FAQ") ? (
                  <FAQ sendChatMsg={sendChatMsg} disabled={disableFAQ} />
                ) : _.isEqual(cmp?.name, "list") ? (
                  <>
                    <Avatar
                      sizes="small"
                      className={classes.avatar}
                      style={{
                        display: cmp?.type !== "bot" ? "none" : "block",
                        width: 25,
                        height: 25,
                      }}
                      src={`${process?.env?.NEXT_PUBLIC_IMAGEKIT_URL}/Microsite/chatbot.png`}
                    />
                    <ListUI
                      classes={classes}
                      data={cmp?.data?.message}
                      doctorsList={cmp?.doctorData?.data}
                      domainData={domainData}
                      setMessages={setMessages}
                      onClickBookAppointment={onClickBookAppointment}
                      dataToRender={extractDoctorsArray(
                        cmp?.doctorData?.data,
                        cmp?.data?.message
                      )}
                      messages={messages}
                      index={index}
                    />
                  </>
                ) : (
                  <></>
                )}
              </motion.div>
            );
          }
        })}
      </React.Fragment>
      {loading && <Loader />}
    </Grid>
  );
};

export default ChatMessages;

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PropagateLoader
        size={8}
        color={themeConfig.palette.lyfngo.primary.main}
      />
    </div>
  );
};
const MessageComponent = (props) => {
  const {
    data,
    cmp,
    classes,
    index,
    setMessages,
    socket,
    messages,
    generatingMsg,
  } = props;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const renderMessageWithLinks = (message) => {
    // function removeIncompleteSentence(text) {
    // 	let sentences = paragraph.match(/[^\.!\?]+[\.!\?]+/g)
    // 	sentences = sentences.filter((sentence) => {
    // 		return sentence.trim().endsWith('.') || sentence.trim().endsWith('!') || sentence.trim().endsWith('?')
    // 	})
    // 	return sentences.join(' ')
    // }
    let msg = _.isNumber(message) ? _.toString(message) : message;
    return msg?.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <Link
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              wordBreak: "break-word",
              fontWeight: 500,
              color: "#3d9fff",
            }}
          >
            {part}
          </Link>
        );
      }
      return (
        <Typography
          key={index}
          variant="h3"
          style={{
            fontFamily: "Poppins",
            fontWeight: 400,
            fontSize: 13,
            wordBreak: "break-word",
          }}
        >
          {/* {part} */}
          {cmp?.ai_generated && cmp?.part?.length > 254 ? part : part}
        </Typography>
      );
    });
  };
  const onClickUp = (idx, type, cmp) => {
    if (type === "recommend") {
      setMessages((prevState) =>
        prevState.map((item, index) =>
          index === idx
            ? {
                ...item,
                isRecommended: !item?.isRecommended,
                isNotRecommended: item?.isNotRecommended
                  ? false
                  : item?.isNotRecommended,
              }
            : item
        )
      );
      let strObj = JSON.stringify({
        action: "feedback",
        message_id: cmp?.message_id,
        thumbs_up: true,
        thumbs_down: false,
      });
      socket.send(strObj);
    } else {
      setMessages((prevState) =>
        prevState.map((item, index) =>
          index === idx
            ? {
                ...item,
                isNotRecommended: !item?.isNotRecommended,
                isRecommended: item?.isRecommended
                  ? false
                  : item?.isRecommended,
              }
            : item
        )
      );
      let strObj = JSON.stringify({
        action: "feedback",
        message_id: cmp?.message_id,
        thumbs_up: false,
        thumbs_down: true,
      });
      socket.send(strObj);
    }
  };
  let parsedData;
  function convertToJSON(input) {
    try {
      parsedData = JSON.parse(input);
    } catch (e) {
      parsedData = input;
    }
  }
  data && convertToJSON(data);
  return (
    <>
      <div id="chat_message">
        {renderMessageWithLinks(parsedData)}
        {cmp?.type === "bot" &&
          cmp?.isFromSocket &&
          messages?.length - 1 === index && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <div
                className={
                  cmp?.isRecommended ? classes.upIcon : classes.disabled
                }
              >
                <IconButton
                  disabled={cmp?.isNotRecommended}
                  onClick={(e) => {
                    if (!cmp?.isRecommended) {
                      onClickUp(index, "recommend", cmp);
                    }
                  }}
                >
                  <ThumbUp color={cmp?.isRecommended ? "green" : "#000"} />
                </IconButton>
              </div>
              {data && (
                <div
                  className={
                    cmp?.isNotRecommended ? classes.downIcon : classes.disabled
                  }
                >
                  <IconButton
                    disabled={cmp?.isRecommended}
                    onClick={(e) => {
                      if (!cmp?.isNotRecommended) {
                        onClickUp(index, "notrecommend", cmp);
                      }
                    }}
                  >
                    <ThumbDown color={cmp?.isNotRecommended ? "red" : "#000"} />
                  </IconButton>
                </div>
              )}
            </div>
          )}
      </div>
    </>
  );
};

"use-client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { lighten, makeStyles } from "@material-ui/core";
import { Button, Grid } from "@mui/material";
import { themeConfig } from "@/theme/themesConfig";
import Header from "./Header";
import Footer from "./Footer";
import ChatMessages from "./ChatMessages";
import _ from "lodash";
import useAuth from "@/Utils/Hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "7px 12px 0px",
  },
  headerName: {
    backgroundImage: `url('${process?.env?.NEXT_PUBLIC_IMAGEKIT_URL}/Microsite/chatbot_header.svg')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    "& .MuiTypography-h6": {
      fontSize: 15,
      fontFamily: themeConfig.typography.h5.fontFamily,
      color: "#fff",
    },
    "& .MuiTypography-body1": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: themeConfig.typography.h3.fontSize,
      fontFamily: themeConfig.typography.h3.fontFamily,
      color: "#fff",
    },
    "& .MuiSvgIcon-root": {
      fontSize: 12,
    },
  },
  botBody: {
    position: "relative",
    height: 410,
    overflowX: "hidden",
    overflowY: "auto",
    scrollbarWidth: "thin",
    // border:'1px solid'
  },
  messageContainer: {
    padding: "24px 18px",
    position: "relative",
  },
  textContainer: {
    display: "flex",
    gap: 4,
    alignItems: "center",
    marginBottom: 12,
  },
  card: {
    display: "inline-flex",
    padding: "8px 12px",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: "0px 8px 8px 8px",
    background: "#ECEEF5",
    "& .MuiTypography-h3": {
      fontSize: themeConfig.typography.h3.fontSize,
      fontFamily: themeConfig.typography.h3.fontFamily,
      fontWeight: 500,
    },
  },
  botFooter: {
    background: "#fff",
    height: 114,
    borderRadius: "0px 0px 14px 14px",
  },
}));

const BotModal = (props) => {
  const {
    toggleModal,
    showModal,
    domainData,
    groupName,
    botNum,
    bot_custUuid,
    bot_cheadId,
    dynamicTab,
    setDynamicTab,
    tabOrder,
    setTabOrder,
    sendMsg,
    setSendMsg,
    messages,
    setMessages,
    sendChatMsg,
    setCurrentState,
    currentState,
    availSlot,
    setAvailslot,
    userData,
    setUserData,
    selectedUser,
    nextStepCase,
    messageLoader,
    generatingMsg,
    setGeneratingMsg,
    disableFAQ,
    setParams,
    params,
    doctorsList,
    appointmentList,
  } = props;
  const { socket, faqList } = useAuth();
  const classes = useStyles();
  const [propLoading, setPropLoading] = useState(false);
  const [reset, setReset] = useState(false);
  const [endCurrentChat, setEndCurrentChat] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const keyPress = (e) => {
    if (sendMsg === "" && e.keyCode === 13) {
      e.preventDefault();
    } else if (
      e.keyCode === 13 &&
      sendMsg &&
      !messageLoader &&
      !generatingMsg
    ) {
      sendChatMsg(sendMsg);
    }
  };
  const onClickReset = () => {
    setReset(true);
  };
  const endChat = () => {
    setEndCurrentChat(true);
    setCurrentState((prevState) => [
      {
        ...prevState[0],
        ChooseChatOption: {
          ...prevState[0]?.ChooseChatOption,
          endChat: true,
        },
      },
    ]);
    setMessages((prevState) => [
      ...prevState,
      {
        name: "messages",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {
          message: `Thank you for chatting with me. Don't forget to share your feedback!`,
        },
      },
      {
        name: "feedback",
        type: "bot",
        jsonType: "NonCard",
        component: null,
        data: {},
      },
    ]);
  };
  const onClickFaq = () => {
    setMessages((prevState) => [
      ...prevState,
      {
        name: "messages",
        type: "bot",
        jsonType: "card",
        component: "",
        data: {
          message: "Here are a few questions that might be relevant for you",
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
  };
  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          boxShadow: "0px 2px 17px 0px rgba(0, 0, 0, 0.25)",
          zIndex: 999,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          style={{
            width: "410px",
            height: "600px",
            borderRadius: "14px",
            backgroundColor: "#fff",
            marginBottom: "30px",
            marginRight: "9px",
            boxShadow: "0px 2px 17px 0px rgba(0, 0, 0, 0.25)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Header
            domainData={domainData}
            toggleModal={toggleModal}
            groupName={groupName}
            onClickReset={onClickReset}
            loading={propLoading}
            onClickFaq={onClickFaq}
            generatingMsg={generatingMsg}
            messageLoader={messageLoader}
          />
          <Grid
            container
            direction={"column"}
            sx={{ padding: 0, display: "block", position: "relative" }}
            gap={"4px"}
          >
            <Grid item xs={7} className={classes.botBody} id="msgChatBot">
              <ChatMessages
                domainData={domainData}
                groupName={groupName}
                botNum={botNum}
                showModal={showModal}
                bot_cheadId={bot_cheadId}
                bot_custUuid={bot_custUuid}
                loading={propLoading}
                setLoading={setPropLoading}
                socket={socket}
                messages={messages}
                setMessages={setMessages}
                resetBot={reset}
                setReset={setReset}
                setCurrentState={setCurrentState}
                currentState={currentState}
                availSlot={availSlot}
                setAvailslot={setAvailslot}
                userData={userData}
                setUserData={setUserData}
                botSelectedUser={selectedUser}
                nextStepCase={nextStepCase}
                sendChatMsg={sendChatMsg}
                endChat={endChat}
                setEndCurrentChat={setEndCurrentChat}
                generatingMsg={generatingMsg}
                setGeneratingMsg={setGeneratingMsg}
                disabled={disabled}
                setDisabled={setDisabled}
                disableFAQ={disableFAQ}
                setParams={setParams}
                params={params}
                doctorsList={doctorsList}
                appointmentList={appointmentList}
              />
            </Grid>
            {messages?.length <= 1 && (
              <Grid
                item
                xs={7}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 5,
                  alignItems: "flex-end",
                  justifyContent: "right",
                  paddingInline: 12,
                }}
              >
                {_.map(faqList, (item, idx) => {
                  return (
                    <Button
                      key={idx}
                      id={item?.id}
                      sx={{
                        height: "38px",
                        textTransform: "none",
                        color: themeConfig.palette.lyfngo.primary.main,
                        paddingInline: 2,
                        paddingBlock: 2,
                        fontFamily: themeConfig.typography.subtitle1.fontFamily,
                        "&:hover": {
                          background: themeConfig.palette.lyfngo.primary.main,
                          color: "#fff",
                          border: `1px solid ${themeConfig.palette.lyfngo.primary.main}`,
                        },
                        fontSize: themeConfig.typography.subtitle1.fontSize,
                        border: `1px solid ${themeConfig.palette.lyfngo.primary.main}`,
                      }}
                      variant="outlined"
                      style={{ borderRadius: "10px" }}
                      onClick={item?.onClick}
                    >
                      {item?.name}
                    </Button>
                  );
                })}
              </Grid>
            )}
          </Grid>
          <Footer
            dynamicTab={dynamicTab}
            setDynamicTab={setDynamicTab}
            tabOrder={tabOrder}
            setTabOrder={setTabOrder}
            sendMsg={sendMsg}
            setSendMsg={setSendMsg}
            loading={propLoading}
            keyPress={keyPress}
            sendChatMsg={sendChatMsg}
            endChat={endCurrentChat}
            setEndCurrentChat={setEndCurrentChat}
            setCurrentState={setCurrentState}
            setReset={setReset}
            messageLoader={messageLoader}
            generatingMsg={generatingMsg}
            disabled={disabled}
            setDisabled={setDisabled}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default BotModal;

"use-client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { InputAdornment, makeStyles } from "@material-ui/core";
import { Grid, IconButton, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { themeConfig } from "@/theme/themesConfig";
import Image from "next/image";
import _ from "lodash";
const useStyles = makeStyles((theme) => ({
  botFooter: {
    background: "#fff",
    height: 114,
    borderRadius: "0px 0px 14px 14px",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
  },
  input: {
    flex: 1,
    background: "#ECEEF5",
    borderRadius: 10,
    "& .MuiOutlinedInput-notchedOutline": {
      border: "0px",
      color: "#000",
    },
    "& .MuiInputBase-input": {
      fontFamily: themeConfig.typography.h5.fontFamily,
    },
    "& .MuiSvgIcon-root": {
      color: "#000",
    },
  },
  textField: {
    position: "absolute",
    bottom: 0,
  },
  footerTab: {
    height: "40px",
    "& .MuiTypography-subtitle1": {
      fontSize: 10,
      fontFamily: themeConfig.typography.h3.fontFamily,
      color: "#727272",
    },
  },
  activeDot: {
    position: "absolute",
    top: -3,
    left: "53%",
    transform: "translateX(-50%)",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#2E9BFF",
  },
}));

const Footer = (props) => {
  const classes = useStyles();
  const {
    tabOrder,
    sendMsg,
    setSendMsg,
    keyPress,
    sendChatMsg,
    endChat,
    setEndCurrentChat,
    setReset,
    messageLoader,
    generatingMsg,
    setCurrentState,
    setDisabled,
  } = props;
  const inputRef = useRef(null);

  const [error, setError] = useState(false);

  useEffect(() => {
    if (!messageLoader || !generatingMsg) {
      inputRef?.current?.focus();
    }
  }, [messageLoader, generatingMsg]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z0-9.,/\-_ ]/gi, "");
    setSendMsg(value);
    if (value.length === 0) {
      setError(false);
    } else if (value.length >= 500) {
      setError(true);
    } else {
      setError(false);
    }
  };
  return (
    <>
      {endChat ? (
        <Grid
          item
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 114,
          }}
        >
          <Typography
            style={{
              fontFamily: "Poppins",
              fontSize: 13,
              color: "#616161",
              fontWeight: 500,
            }}
          >
            Your Chat has ended
          </Typography>
          <a
            onClick={() => {
              setEndCurrentChat(false);
              setReset(true);
              setCurrentState({});
              setDisabled(false);
            }}
          >
            <Typography
              style={{
                fontFamily: "Poppins",
                fontSize: 13,
              }}
              sx={{
                "&:hover": {
                  textDecorationLine: "underline",
                  cursor: "pointer",
                },
              }}
            >
              To start new chat, Click here
            </Typography>
          </a>
        </Grid>
      ) : (
        <Grid
          item
          xs={3}
          className={classes.botFooter}
          sx={{
            display: !_.isEqual(tabOrder, 0) && "flex",
            justifyContent: "center",
            alignItems: "self-end",
          }}
        >
          {_.isEqual(tabOrder, 0) && (
            <motion.div className={classes.footer}>
              <motion.div className={classes.input} layout>
                <TextField
                  id="fullWidth"
                  className={classes.textField}
                  size="small"
                  autoFocus
                  inputRef={inputRef}
                  autoComplete="off"
                  fullWidth
                  variant="outlined"
                  multiline
                  maxRows={sendMsg?.length > 35 ? 2 : 1}
                  value={sendMsg}
                  disabled={messageLoader || generatingMsg}
                  onChange={(e) => setSendMsg(e.target.value)}
                  onKeyDown={(e) =>
                    (sendMsg !== null || sendMsg !== "") && keyPress(e)
                  }
                  placeholder={"Send a message..."}
                  inputProps={{ maxLength: 500 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="send"
                          id="send_msg_btn"
                          edge="end"
                          onClick={() =>
                            (sendMsg !== null || sendMsg !== "") &&
                            sendChatMsg(sendMsg)
                          }
                          disabled={messageLoader || generatingMsg || error}
                        >
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={error}
                  helperText={
                    error ? "Message should be less then 500 characters." : ""
                  }
                />
              </motion.div>
            </motion.div>
          )}
          {sendMsg !== null && sendMsg?.length <= 35 && (
            <Grid
              className={classes.footerTab}
              container
              direction={"rows"}
              alignItems={"center"}
              justifyContent={"center"}
              alignContent={"center"}
              textAlign={"center"}
            >
              <Grid
                item
                sx={{
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="subtitle1">Powered by</Typography>
                <Image
                  src={`${process?.env?.NEXT_PUBLIC_IMAGEKIT_URL}/Microsite/LYFnGO_logo_chatbot.svg`}
                  priority={true}
                  width={78}
                  height={17}
                  alt={"LYFnGO"}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};

export default Footer;

"use-client";
import React from "react";
import { makeStyles } from "@material-ui/core";
import {
  Box,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import QuizIcon from "@mui/icons-material/Quiz";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import { themeConfig } from "@/theme/themesConfig";
import { textAlign } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "8px",
    background: themeConfig.palette.lyfngo.primary.main,
    margin: "5px",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    "& .MuiTypography-h6": {
      fontSize: 15,
      fontFamily: themeConfig.typography.h5.fontFamily,
      color: "#fff",
      textAlign: "center",
    },
    "& .MuiTypography-body1": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: themeConfig.typography.h3.fontSize,
      fontFamily: themeConfig.typography.h3.fontFamily,
      color: "#fff",
    },
  },
  headerName: {
    flexDirection: "row",
  },
  iconContainer: {
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  },
}));

const Header = (props) => {
  const classes = useStyles();
  const {
    toggleModal,
    onClickReset,
    loading,
    onClickFaq,
    generatingMsg,
    messageLoader,
  } = props;
  // console.log('load', loading, generatingMsg)
  return (
    <>
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Image
            src={`${process?.env?.NEXT_PUBLIC_IMAGEKIT_URL}/Microsite/chatbot.png`}
            alt="Happy Clinic Logo"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              marginBottom: 10,
            }}
            width={100}
            height={100}
            priority={true}
          />
          <Typography
            variant="h6"
            style={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: 14 }}
          >
            AI Chatbot
          </Typography>
        </div>
        <div className={classes.iconContainer}>
          <IconButton
            onClick={() => {
              if (!loading && !generatingMsg && !messageLoader) onClickFaq();
            }}
            size="medium"
            id="faq"
          >
            <QuizIcon />
          </IconButton>
          <IconButton
            onClick={!loading && onClickReset}
            size="medium"
            id="reset"
          >
            <RestartAltIcon />
          </IconButton>
          <IconButton onClick={toggleModal} size="medium" id="close">
            <KeyboardArrowDownIcon sx={{ fontSize: "28px" }} />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default Header;

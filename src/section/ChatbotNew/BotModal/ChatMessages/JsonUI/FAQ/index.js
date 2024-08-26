"use-client";
import { Avatar, IconButton, Typography, makeStyles } from "@material-ui/core";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { themeConfig } from "@/theme/themesConfig";
import _ from "lodash";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import BotApi from "@/service/BotApi";
import useAuth from "@/Utils/Hooks/useAuth";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    gap: 4,
    marginLeft: "30px",
  },
  loadMore: {
    "& .MuiIconButton-root": {
      padding: 0,
      "& .MuiSvgIcon-root": {
        color: themeConfig.palette.lyfngo.primary.main,
      },
    },
  },
}));
const FAQ = (props) => {
  const classes = useStyles();
  const { sendChatMsg, disabled } = props;
  const { domainData } = useAuth();
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const onSuccess = (res) => {
      setQuestions(res?.data);
      setDefaultQuestions(res?.data?.slice(0, numberOfSlotsToShow));
    };
    const onFailure = () => {
      setQuestions([]);
    };
    BotApi.getFAQ(domainData?.mastTentUuid).then(onSuccess, onFailure);
  }, []);
  const numberOfSlotsToShow = 4;
  const [currentIndex, setCurrentIndex] = useState(numberOfSlotsToShow);
  const [defaultQuestions, setDefaultQuestions] = useState();
  const seeMore = () => {
    const nextIndex = currentIndex + numberOfSlotsToShow;
    setDefaultQuestions(questions.slice(0, nextIndex));
    setCurrentIndex(nextIndex);
  };
  return (
    !_.isEmpty(questions) && (
      <motion.div className={classes.root}>
        <div>
          {_.map(defaultQuestions, (item, idx) => {
            return (
              <Button
                sx={{
                  width: "320px",
                  textTransform: "none",
                  color: themeConfig.palette.lyfngo.primary.main,
                  flexDirection: "column",
                  marginBottom: "10px",
                  padding: "8px",
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
                onClick={() => sendChatMsg(item)}
                disabled={disabled}
              >
                <Typography
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {item}
                </Typography>
              </Button>
            );
          })}
          {questions.length > defaultQuestions?.length && !disabled && (
            <div
              className={classes.loadMore}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton onClick={seeMore}>
                <RotateLeftIcon />
              </IconButton>
              <Typography
                variant="subtitle1"
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins",
                  color: themeConfig.palette.lyfngo.primary.main,
                  cursor: "pointer",
                }}
                onClick={seeMore}
              >
                Load more
              </Typography>
            </div>
          )}
        </div>
      </motion.div>
    )
  );
};

export default FAQ;

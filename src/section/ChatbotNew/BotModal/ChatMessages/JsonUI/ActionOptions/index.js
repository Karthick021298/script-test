"use-client";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import _ from "lodash";
import { themeConfig } from "@/theme/themesConfig";
const ActionOptions = (props) => {
  const { actions, data, currentState, messages, setMessages, index } = props;
  const onClick = (data) => {
    let newArr = _.map(messages, (item, idx) => {
      return idx === index ? { ...item, disabled: true } : item;
    });
    setMessages(newArr);
    data?.onPress();
  };
  const renderActions = () => {
    return _.map(actions, (item, idx) => {
      return (
        <motion.div
          whileTap={{ scale: 0.95 }}
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            height: "50px",
            display: "flex",
            alignSelf: "flex-end",
          }}
        >
          <Button
            sx={{
              maxWidth: "160px",
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
            id={item?.id ? item?.id : `actionBtn${idx}`}
            variant="outlined"
            style={{ borderRadius: "10px" }}
            onClick={() => onClick(item)}
            disabled={
              _.isEqual(item?.actionName, "End Chat")
                ? index === messages?.length - 1
                  ? false
                  : true || data?.disabled
                : data?.disabled
            }
          >
            {item?.actionName}
          </Button>
        </motion.div>
      );
    });
  };
  return (
    <div style={{ display: "flex", gap: 6, marginLeft: 30, flexWrap: "wrap" }}>
      {renderActions()}
    </div>
  );
};

export default ActionOptions;

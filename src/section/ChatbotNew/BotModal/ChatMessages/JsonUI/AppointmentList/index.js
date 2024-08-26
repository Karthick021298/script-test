"use-client";
import {
  Avatar,
  IconButton,
  Tooltip,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { themeConfig } from "@/theme/themesConfig";
import moment from "moment";
import _ from "lodash";
import BotApi from "@/service/BotApi";
const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    gap: 4,
    // alignItems: 'center'
  },
  container: {
    border: `2px solid ${themeConfig.palette.lyfngo.primary.main}`,
    borderRadius: 10,
    paddingInline: 20,
    paddingBlock: 10,
    marginBottom: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: themeConfig.palette.lyfngo.primary.main,
    justifyContent: "center",
    "& :hover": {
      // border: `2px solid ${themeConfig.palette.lyfngo.primary.main}`,
      display: "flex",
      // flexDirection: 'column',
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      color: "#fff",
    },
  },
  textStyle: {
    fontFamily: "Poppins",
    fontSize: 14,
    fontWeight: "bold",
    color: themeConfig.palette.lyfngo.primary.main,
  },
}));
const AppointmentList = (props) => {
  const classes = useStyles();
  const {
    userData,
    setMessages,
    setApptDetails,
    setUserData,
    setLoading,
    endChat,
    appointmentList,
    messages,
    index,
    data,
  } = props;
  const cancelAppointment = (item, uuid) => {
    setMessages((prevState) => [
      ...prevState,
      {
        name: "Message",
        type: "cust",
        jsonType: "card",
        component: "",
        data: {
          message: item,
        },
      },
    ]);
    setLoading(true);
    const body = {
      uuid: uuid,
      reason: item,
      custSms: true,
      custMail: true,
      tentSms: true,
      tentMail: true,
      type: "TENT",
    };
    BotApi.cancelAppt(body).then(
      (res) => {
        if (res?.data?.status === "success") {
          setLoading(false);
          setMessages((prevState) => [
            ...prevState,
            {
              name: "Message",
              type: "bot",
              jsonType: "card",
              component: "",
              data: {
                message: "Successfully cancelled your appointment",
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
                  actionName: "End Chat",
                  id: "endchat",
                  onPress: () => endChat(),
                },
              ],
            },
          ]);
        }
      },
      () => {
        setLoading(false);
        setMessages((prevState) => [
          ...prevState,
          {
            name: "Message",
            type: "bot",
            jsonType: "card",
            component: "",
            data: {
              message: "Failed to cancel appointment.Please try again",
            },
          },
        ]);
      }
    );
  };
  const onClickReschedule = () => {
    setUserData((prevState) => ({
      ...prevState,
      endpoint: "reschedule_appointment",
    }));
    setMessages((prevState) => [
      ...prevState,
      {
        name: "DateSelection",
        type: "bot",
        jsonType: "card",
        component: "DateSelection",
        data: {
          message: "Please choose the appointment date to reschedule",
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
  const onClick = (item) => {
    if (_.isEqual(userData?.endpoint, "get_appointment")) {
      setMessages((prevState) => [
        ...prevState,
        {
          name: "appointment",
          type: "cust",
          jsonType: "card",
          component: "",
          data: {
            message: `${
              item?.app_time ||
              moment(item?.appointmentStartTime, "YYYY-MM-DD HH:mm:ss").format(
                "hh:mm A"
              )
            }
                        ${moment(
                          item?.app_date || item?.appointmentStartTime,
                          "YYYY-MM-DD"
                        ).format("dddd-DD-MM-YYYY")}`,
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
              actionName: "Reschedule",
              id: "reschedule_appt",
              onPress: () => onClickReschedule(),
            },
            {
              actionName: "Cancel",
              id: "cancel_appt",
              onPress: () =>
                setMessages((prevState) => [
                  ...prevState,
                  {
                    name: "Message",
                    type: "bot",
                    jsonType: "card",
                    component: "",
                    data: {
                      message: "Please choose a reason for cancellation",
                    },
                  },
                  {
                    name: "actions",
                    type: "bot",
                    jsonType: "",
                    disabled: false,
                    component: "",
                    data: _.map(cancelReasons, (reason, idx) => {
                      return {
                        actionName: reason,
                        id: `cancelreason${idx + 1}`,
                        onPress: () =>
                          cancelAppointment(
                            reason,
                            item?.app_uuid || item?.appointmentUuid
                          ),
                      };
                    }),
                  },
                ]),
            },
          ],
        },
      ]);
    } else if (_.isEqual(userData?.endpoint, "cancel_appointment")) {
      setMessages((prevState) => [
        ...prevState,
        {
          name: "Cancel",
          type: "cust",
          jsonType: "card",
          component: "",
          data: {
            message: `${
              item?.app_time ||
              moment(item?.appointmentStartTime, "YYYY-MM-DD HH:mm:ss").format(
                "hh:mm A"
              )
            }
                        ${moment(
                          item?.app_date || item?.appointmentStartTime,
                          "YYYY-MM-DD"
                        ).format("dddd-DD-MM-YYYY")}`,
          },
        },
        {
          name: "Message",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message: "Please choose a reason for cancellation",
          },
        },
        {
          name: "actions",
          type: "bot",
          jsonType: "",
          disabled: false,
          component: "",
          data: _.map(cancelReasons, (reason, idx) => {
            return {
              actionName: reason,
              id: `cancelreason${idx + 1}`,
              onPress: () =>
                cancelAppointment(
                  reason,
                  item?.app_uuid || item?.appointmentUuid
                ),
            };
          }),
        },
      ]);
    } else {
      setMessages((prevState) => [
        ...prevState,
        {
          name: "Reschedule",
          type: "cust",
          jsonType: "card",
          component: "",
          data: {
            message: `${
              item?.app_time ||
              moment(item?.appointmentStartTime, "YYYY-MM-DD HH:mm:ss").format(
                "hh:mm A"
              )
            }
                    ${moment(
                      item?.app_date || item?.appointmentStartTime,
                      "YYYY-MM-DD"
                    ).format("dddd-DD-MM-YYYY")}`,
          },
        },
        {
          name: "DateSelection",
          type: "bot",
          jsonType: "card",
          component: "DateSelection",
          data: {
            message: "Please choose the appointment date to reschedule",
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
    }
  };
  const apptData = !_.isEmpty(userData?.appointment_details)
    ? userData?.appointment_details
    : appointmentList;
  return (
    <motion.div className={classes.root}>
      <Avatar
        sizes="small"
        style={{ width: 25, height: 25 }}
        className={classes.avatar}
        src={`${process?.env?.NEXT_PUBLIC_IMAGEKIT_URL}/Microsite/chatbot.png`}
      />
      <div>
        {_.map(apptData, (item, idx) => {
          return (
            <Button
              sx={{
                width: "240px",
                textTransform: "none",
                color: themeConfig.palette.lyfngo.primary.main,
                flexDirection: "column",
                marginBottom: "10px",
                padding: 2,
                fontFamily: themeConfig.typography.subtitle1.fontFamily,
                "&:hover": {
                  background: themeConfig.palette.lyfngo.primary.main,
                  color: "#fff",
                  border: `1px solid ${themeConfig.palette.lyfngo.primary.main}`,
                },
                fontSize: themeConfig.typography.subtitle1.fontSize,
                border: `1px solid ${themeConfig.palette.lyfngo.primary.main}`,
              }}
              key={idx}
              id={"appointment"}
              variant="outlined"
              style={{ borderRadius: "10px" }}
              disabled={data?.disabled || index !== messages.length - 1}
              onClick={() => {
                setApptDetails(item);
                // if (userData?.endpoint !== 'get_appointment') {
                let newArr = _.map(messages, (item, id) => {
                  return id === index ? { ...item, disabled: true } : item;
                });
                setMessages(newArr);
                onClick(item);
                // }
              }}
            >
              <Typography
                style={{
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {item?.app_time ||
                  moment(
                    item?.appointmentStartTime,
                    "YYYY-MM-DD HH:mm:ss"
                  ).format("hh:mm A")}{" "}
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 14,
                    fontWeight: 400,
                  }}
                >
                  {"on"}
                </span>{" "}
                {moment(
                  item?.app_date || item?.appointmentStartTime,
                  "YYYY-MM-DD"
                ).format("DD-MM-YYYY")}
              </Typography>
              <Typography
                style={{
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                {"with"}
              </Typography>
              <Typography
                style={{
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {item?.doc_salutation || item?.tentUserSalutation
                  ? `${item?.doc_salutation || item?.tentUserSalutation}. ${
                      item?.doc_name || item?.tentUserFirstName
                    }`
                  : item?.doc_name || item?.tentUserFirstName}
              </Typography>
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AppointmentList;
const cancelReasons = [
  "This was scheduled by accident",
  "Cost is high",
  "Want a different consultant",
];

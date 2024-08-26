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
import StarIcon from "@mui/icons-material/Star";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
const useStyles = makeStyles((theme) => ({
  wrapper: {
    borderRadius: 10,
    border: "1px solid #d9d9d9",
    padding: 8,
    marginBottom: 8,
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  rating: {
    "& .MuiIconButton-root": {
      padding: 0,
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: "#FFCE45",
      },
    },
  },
  loadMore: {
    "& .MuiIconButton-root": {
      padding: 0,
      "& .MuiSvgIcon-root": {
        color: themeConfig.palette.lyfngo.primary.main,
      },
    },
  },
  speciality: {
    paddingInline: 4,
    paddingBlock: 2,
    backgroundColor: "#0062DD1A",
    display: "flex",
    borderRadius: 8,
  },
  moreBtn: {
    fontFamily: "Poppins",
    fontSize: 12,
    fontWeight: 500,
    color: themeConfig.palette.lyfngo.primary.main,
    cursor: "pointer",
  },
}));
const ChooseSpecialist = (props) => {
  const {
    data,
    userList,
    totalCount,
    loadMore,
    selectUser,
    currentState,
    index,
    messages,
    setMessages,
  } = props;
  const classes = useStyles();
  const [viewAllSpecialities, setViewAllSpecialities] = useState({});
  const [showLanguages, setShowLanguages] = useState({});
  const toggleLanguagesForCard = (e, tentUserUuid) => {
    e.stopPropagation();
    setShowLanguages((prevState) => ({
      ...prevState,
      [tentUserUuid]: !prevState[tentUserUuid],
    }));
  };
  const onClick = (item) => {
    let newArr = _.map(messages, (item, idx) => {
      return idx === index ? { ...item, disabled: true } : item;
    });
    setMessages(newArr);
    selectUser(item);
  };
  return (
    <div>
      {_.map(userList, (item, idx) => {
        let userData = item?.tentUserDTO;
        return (
          item?.appointmentMode && (
            <div
              whileTap={{ scale: 0.95 }}
              style={{
                borderRadius: "10px",
                maxWidth: 300,
              }}
              key={idx}
            >
              <div className={classes.wrapper}>
                <div className={classes.userInfo}>
                  <Avatar
                    variant="square"
                    style={{ width: 30, height: 30, borderRadius: 5 }}
                  />
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        maxWidth: "300px",
                      }}
                    >
                      <Tooltip
                        title={`${userData?.tentUserSalutation}. ${userData?.tentUserName}`}
                        arrow
                        placement="bottom"
                      >
                        <Typography
                          variant="subtitle1"
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            fontFamily: "Poppins",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: 170,
                          }}
                        >
                          {userData?.tentUserSalutation}.{" "}
                          {userData?.tentUserName}
                        </Typography>
                      </Tooltip>
                      {item?.totalFeedbackCount && (
                        <div
                          className={classes.rating}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconButton>
                            <StarIcon />
                          </IconButton>
                          <Typography
                            variant="subtitle1"
                            style={{
                              fontSize: 12,
                              fontFamily: "Poppins",
                              color: "#FFCE45",
                              marginTop: 2,
                            }}
                          >
                            {(
                              item?.totalFeedbackStar / item?.totalFeedbackCount
                            ).toFixed(1)}
                          </Typography>
                        </div>
                      )}
                    </div>
                    {userData?.specialityListDTO?.length > 2 ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 5,
                          alignItems: "center",
                        }}
                      >
                        <div className={classes.speciality}>
                          <Typography
                            variant="subtitle1"
                            style={{
                              fontSize: 11,
                              fontFamily: "Poppins",
                              color: "#0062DD",
                            }}
                          >{`${
                            (userData?.specialityListDTO || [])[0]
                              ?.specialityName
                          }`}</Typography>
                        </div>
                        <div className={classes.speciality}>
                          <Typography
                            variant="subtitle1"
                            style={{
                              fontSize: 11,
                              fontFamily: "Poppins",
                              color: "#0062DD",
                            }}
                          >{`${
                            (userData?.specialityListDTO || [])[1]
                              ?.specialityName
                          }`}</Typography>
                        </div>
                        {viewAllSpecialities[userData?.tentUserUuid] && (
                          <>
                            {(userData?.specialityListDTO || [])
                              .slice(2)
                              .map((speciality, idx) => (
                                <div key={idx} className={classes.speciality}>
                                  <Typography
                                    variant="subtitle1"
                                    style={{
                                      fontSize: 11,
                                      fontFamily: "Poppins",
                                      color: "#0062DD",
                                    }}
                                  >
                                    {speciality.specialityName}
                                  </Typography>
                                </div>
                              ))}
                            <span
                              className={classes.moreBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewAllSpecialities((prev) => ({
                                  ...prev,
                                  [userData?.tentUserUuid]: false,
                                }));
                              }}
                            >
                              {" "}
                              View Less
                            </span>
                          </>
                        )}
                        {!viewAllSpecialities[userData?.tentUserUuid] && (
                          <span
                            className={classes.moreBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewAllSpecialities((prev) => ({
                                ...prev,
                                [userData?.tentUserUuid]: true,
                              }));
                            }}
                          >
                            + {(userData?.specialityListDTO || [])?.length - 2}{" "}
                            more
                          </span>
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 5,
                        }}
                      >
                        {userData?.specialityListDTO &&
                          _.map(userData?.specialityListDTO, (item, idx) => {
                            return (
                              <div className={classes.speciality}>
                                <Typography
                                  variant="subtitle1"
                                  style={{
                                    fontSize: 12,
                                    fontFamily: "Poppins",
                                    color: "#0062DD",
                                  }}
                                >{`${item.specialityName}`}</Typography>
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {userData?.tentUserExperience && (
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins",
                          color: "#A4A4A4",
                        }}
                      >{`${userData?.tentUserExperience} years experience overall`}</Typography>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  <div>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins",
                        color: "#8CC63F",
                      }}
                    >
                      &#x25cf; Available Now
                    </Typography>

                    {item?.languagesKnown && (
                      <Typography
                        style={{
                          fontSize: 12,
                          fontFamily: "Poppins",
                          color: "#A4A4A4",
                          width: 200,
                          overflow: "clip",
                        }}
                      >
                        {showLanguages[userData?.tentUserUuid] ||
                        JSON.parse(item?.languagesKnown).length <= 2
                          ? JSON.parse(item?.languagesKnown).join(", ")
                          : JSON.parse(item?.languagesKnown)
                              .slice(0, 2)
                              .join(", ")}
                        {JSON.parse(item?.languagesKnown).length > 2 && (
                          <span
                            style={{
                              color:
                                themeConfig?.palette?.lyfngo?.primary?.main,
                            }}
                            onClick={(e) =>
                              toggleLanguagesForCard(e, userData?.tentUserUuid)
                            }
                          >
                            {showLanguages[userData?.tentUserUuid]
                              ? " view less"
                              : ` +${
                                  JSON.parse(item?.languagesKnown).length - 2
                                } more`}
                          </span>
                        )}
                      </Typography>
                    )}
                  </div>
                  <div>
                    <Button
                      sx={{
                        maxWidth: "100px",
                        height: "35px",
                        textTransform: "none",
                        background: themeConfig.palette.lyfngo.primary.main,
                        color: "#fff",
                        paddingInline: 2,
                        fontFamily: themeConfig.typography.subtitle1.fontFamily,
                        fontSize: themeConfig.typography.subtitle1.fontSize,
                        border: `1px solid ${themeConfig.palette.lyfngo.primary.main}`,
                        "&:hover": {
                          background: themeConfig.palette.lyfngo.primary.main,
                          color: "#fff",
                          border: `1px solid ${themeConfig.palette.lyfngo.primary.main}`,
                        },
                      }}
                      className={classes.disabled}
                      variant="outlined"
                      style={{ borderRadius: "10px" }}
                      id={`specialist${idx + 1}`}
                      onClick={() => onClick(item)}
                      disabled={data?.disabled}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        );
      })}
      {totalCount !== userList.length && (
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
          <IconButton
            onClick={loadMore}
            disabled={currentState[0]?.ChooseChatOption?.selectUser}
          >
            <RotateLeftIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            style={{
              fontSize: 13,
              fontFamily: "Poppins",
              color: themeConfig.palette.lyfngo.primary.main,
              cursor: currentState[0]?.ChooseChatOption?.selectUser
                ? "not-allowed"
                : "pointer",
            }}
            onClick={!currentState[0]?.ChooseChatOption?.selectUser && loadMore}
          >
            Load more
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ChooseSpecialist;

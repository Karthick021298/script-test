"use-client";
import { Box, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { themeConfig } from "@/theme/themesConfig";
import _ from "lodash";
import Slider from "react-slick";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  CalendarMonth,
} from "@mui/icons-material";
import Image from "next/image";
import { IconButton } from "@mui/material";

const ListUI = (props) => {
  const { classes, dataToRender, onClickBookAppointment, messages, index } =
    props;
  let dataLength = dataToRender?.length;
  const multiSliderConfig = {
    className: "center",
    centerMode: true,
    centerPadding: "10px",
    infinity: true,
    slidesToShow: 2,
    speed: 500,
    dots: true,
    nextArrow: (
      <IconButton size="small">
        <ArrowForwardIos />
      </IconButton>
    ),
    prevArrow: (
      <IconButton size="small">
        <ArrowBackIosNew />
      </IconButton>
    ),
  };
  const sliderConfig = {
    className: "center",
    centerMode: true,
    infinity: true,
    slidesToShow: 1,
    speed: 500,
    dots: true,
    nextArrow: (
      <IconButton size="small">
        <ArrowForwardIos />
      </IconButton>
    ),
    prevArrow: (
      <IconButton size="small">
        <ArrowBackIosNew />
      </IconButton>
    ),
  };
  let config = dataLength > 2 ? multiSliderConfig : sliderConfig;
  return (
    <>
      {_.isEmpty(dataToRender) ? (
        <div
          style={{
            // maxWidth: '90%',
            background: "#ECEEF5",
            borderRadius: "10px",
            padding: 8,
          }}
        >
          <Typography
            style={{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 13,
              wordBreak: "break-word",
            }}
          >
            Sorry, I couldn't find an answer to your question. Could you please
            rephrase it or provide more details?
          </Typography>
        </div>
      ) : (
        <motion.div className={classes.slider}>
          <Slider {...config}>
            {_.map(dataToRender, (item, idx) => {
              return (
                <div style={{ perspective: 1000, border: "1px solid" }}>
                  {/* <div className={classes.cardContainer}>
										<div className={classes.card}>
											<div className={`${classes.cardFace} ${classes.cardFront}`}>
												<div className={classes.cardTitle}>Card Title</div>
												<div className={classes.cardDescription}>Short description here</div>
											</div>
											<div className={`${classes.cardFace} ${classes.cardBack}`}>
												<div className={classes.cardTitle}>Detailed Info</div>
												<div className={classes.cardDescription}>This is the description that appears when the card is flipped.</div>
											</div>
										</div>
									</div> */}

                  <div
                    className={`${classes.slideContainer} ${classes.cardHovered}`}
                    key={idx}
                    id="select"
                  >
                    <div>
                      <Image
                        src={`${process?.env?.NEXT_PUBLIC_IMAGEKIT_URL}/doctors.svg`}
                        height={65}
                        width={65}
                        style={{ borderRadius: 10 }}
                        alt="doc"
                      />
                    </div>
                    <div className={classes.slideContent}>
                      <Typography
                        style={{
                          fontFamily: themeConfig.typography.h3.fontFamily,
                          fontSize: 15,
                          fontWeight: 500,
                          textAlign: "center",
                        }}
                      >
                        {item?.Name}
                      </Typography>
                      {item?.department && (
                        <Typography
                          style={{
                            fontFamily: themeConfig.typography.h3.fontFamily,
                            fontSize: 13,
                            fontWeight: 400,
                            color: "#727272",
                          }}
                        >
                          {item?.department}
                        </Typography>
                      )}
                      {item?.qualifications && (
                        <Typography
                          style={{
                            fontFamily: themeConfig.typography.h3.fontFamily,
                            fontSize: 13,
                            fontWeight: 400,
                            color: "#727272",
                          }}
                        >
                          {item?.qualifications}
                        </Typography>
                      )}
                      {item?.Experience !== "NA" && (
                        <Typography
                          style={{
                            fontFamily: themeConfig.typography.h3.fontFamily,
                            fontSize: 13,
                            fontWeight: 400,
                            color: "#727272",
                            textAlign: "center",
                          }}
                        >
                          {`${item?.Experience} of experience`}
                        </Typography>
                      )}
                      {item?.Specialty !== "NA" && (
                        <Typography
                          style={{
                            fontFamily: themeConfig.typography.h3.fontFamily,
                            fontSize: 13,
                            fontWeight: 400,
                            color: "#727272",
                            textAlign: "center",
                          }}
                        >
                          {item?.Specialty}
                        </Typography>
                      )}
                    </div>
                    <Box className={classes.overlay}>
                      <Typography
                        variant="body2"
                        style={{
                          color: "#000",
                          textAlign: "center",
                          fontFamily: "Poppins",
                          fontWeight: 500,
                        }}
                      >
                        {item?.Description}
                      </Typography>
                    </Box>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      paddingTop: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      padding: "8px",
                      borderRadius: 10,
                      background: "#ECEFFF",
                      width: 200,
                      cursor:
                        index === messages?.length - 1
                          ? "pointer"
                          : "not-allowed",
                    }}
                    onClick={() =>
                      index === messages?.length - 1 &&
                      onClickBookAppointment(item?.Name)
                    }
                  >
                    <CalendarMonth size={20} />
                    <Typography
                      style={{
                        fontFamily: themeConfig.typography.h3.fontFamily,
                        color:
                          index === messages?.length - 1
                            ? themeConfig.palette.lyfngo.primary.main
                            : "#C6C6C6",
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: "center",
                      }}
                    >
                      Book appointment
                    </Typography>
                  </div>
                </div>
              );
            })}
          </Slider>
        </motion.div>
      )}
    </>
  );
};

export default ListUI;

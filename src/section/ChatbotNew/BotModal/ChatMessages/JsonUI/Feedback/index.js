import React, { useState } from "react";
import { Button, Typography, makeStyles } from "@material-ui/core";
import { Rating, TextField } from "@mui/material";
import { themeConfig } from "@/theme/themesConfig";
import { fontFamily, fontSize, textAlign } from "@mui/system";
import BotApi from "@/service/BotApi";
import secureLocalStorage from "react-secure-storage";
import useAuth from "@/Utils/Hooks/useAuth";
const useStyles = makeStyles((theme) => ({
  ratingStar: {
    textAlign: "center",
    marginBlock: "12px",
    "& .MuiRating-root": {
      color: "#FFCE45",
      fontSize: "1.6rem",
    },
  },
  root: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    background: "#fff",
    borderRadius: "10px",
    "& .MuiOutlinedInput-root": {
      padding: 12,
      alignItems: "start",
      "&:hover fieldset": {
        borderColor: "#cbcbcb",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#cbcbcb",
      },
    },
    "& .MuiInputBase-root": {
      fontSize: themeConfig.typography.subtitle1.fontSize,
      fontFamily: themeConfig.typography.subtitle1.fontFamily,
      height: 80,
      borderRadius: "10px",
      background: "#fff",
    },
    "& .MuiFormHelperText-root": {
      fontSize: 10,
      textAlign: "right",
      fontFamily: "Poppins",
    },
  },
}));
const Feedback = (props) => {
  const { setMessages, disabled, setDisabled } = props;
  const classes = useStyles();
  const [ratingValue, setRatingValue] = useState(null);
  const [value, setValue] = useState("");
  const CHARACTER_LIMIT = 500;
  const { domainData, bot_custUuid } = useAuth();
  const onSubmit = () => {
    const body = {
      tent_user_uuid: null,
      feedback_star: ratingValue || 0,
      is_recommend: true,
      isBot: true,
      feedback_description: value,
      cust_uuid: bot_custUuid || secureLocalStorage.getItem("custUuid"),
    };
    const onSuccess = () => {
      setMessages((prevState) => [
        ...prevState,
        {
          name: "Welcome",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message: "Thanks for your feedback",
          },
        },
      ]);
      setDisabled(true);
    };
    const onFailure = () => {};
    BotApi.postFeedack(body, domainData?.mastTentUuid).then(
      onSuccess,
      onFailure
    );
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginLeft: 30,
        boxShadow: "0px 0px 4px 0px #d9d9d9",
        borderRadius: 10,
      }}
    >
      <div className={classes.root}>
        <Typography
          style={{
            fontFamily: "Poppins",
            fontWeight: 500,
            fontSize: 13,
          }}
        >
          How satisfied were you chatting with us today?
        </Typography>
        <div className={classes.rating}>
          <Rating
            name="simple-controlled"
            id="star_rating"
            value={ratingValue}
            onChange={(event, newValue) => {
              !disabled && setRatingValue(newValue);
            }}
          />
        </div>
        <TextField
          multiline
          // maxRows={3}
          id="feedback_input"
          rows={2}
          sx={{
            width: 280,
            "& input": {
              padding: 0,
            },
          }}
          className={classes.input}
          inputProps={{
            maxLength: CHARACTER_LIMIT,
          }}
          style={{
            textAlign: "start",
          }}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e?.target?.value)}
          helperText={`${value.length}/${CHARACTER_LIMIT}`}
        />
        <div style={{ justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            style={{
              boxShadow: "none",
              background: disabled
                ? "#00000042"
                : themeConfig.palette.lyfngo.primary.main,
              color: disabled ? "#f4f5f6" : "#fff",
              textTransform: "capitalize",
              fontFamily: "Poppins",
              borderRadius: 10,
            }}
            onClick={onSubmit}
            id="feedback_submit"
            disabled={disabled}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

"use-client";
import React, { useState, useEffect } from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import {
  Autocomplete,
  Button,
  Checkbox,
  InputAdornment,
  MenuItem,
  Popper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { themeConfig } from "@/theme/themesConfig";
import BotApi from "@/service/BotApi";
import secureLocalStorage from "react-secure-storage";
import Axios from "axios";
import ErrorIcon from "@mui/icons-material/Error";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { borderColor, padding, width } from "@mui/system";
import { Token } from "@mui/icons-material";
import useAuth from "@/Utils/Hooks/useAuth";
const useStyles = makeStyles((theme) => ({
  root: {
    paddingBlock: 4,
    "& .MuiAutocomplete-root": {
      "& .MuiOutlinedInput-root": {
        paddingRight: 0,
      },
    },
  },
  input: {
    background: "#fff",
    borderRadius: "10px",
    "& .MuiOutlinedInput-root": {
      borderColor: "#d9d9d9",
      "&. MuiIconButton-root": {
        padding: 0,
      },
      "&. MuiSvgIcon-root": {
        fontSize: 15,
        color: "#FF0000",
      },
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
      height: 40,
      borderRadius: "10px",
      background: "#fff",
    },
  },
  errorInput: {
    background: "#fff",
    borderRadius: "10px",
    "& .MuiOutlinedInput-root": {
      "&. MuiIconButton-root": {
        padding: 0,
      },
      "&. MuiSvgIcon-root": {
        fontSize: 15,
        color: "#FF0000",
      },
    },
    "& .MuiInputBase-root": {
      fontSize: themeConfig.typography.subtitle1.fontSize,
      fontFamily: themeConfig.typography.subtitle1.fontFamily,
      height: 40,
      borderRadius: "10px",
      background: "#fff",
    },
  },
  container: {
    display: "flex",
    "& .MuiOutlinedInput-root": {
      border: "0px solid #FF0000",
      padding: 0,
      "&. MuiIconButton-root": {
        padding: 0,
      },
      "&. MuiSvgIcon-root": {
        fontSize: 15,
        color: "#FF0000",
      },
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
      height: 40,
      borderRadius: "0px 10px 10px 0px",
      background: "#fff",
    },
    "& .MuiAutocomplete-inputRoot": {
      borderRadius: "10px 0px 0px 10px !important",
      // paddingBlock: 10,
      paddingRight: 10,
      border: 0,
    },
    "& .MuiAutocomplete-input": {
      textOverflow: "initial",
    },
    "& .MuiInputBase-input": {
      fontSize: 14,
    },
    "& .MuiFormHelperText-contained": {
      [theme.breakpoints.up("xs")]: {
        marginLeft: -66,
      },
      [theme.breakpoints.up("sm")]: {
        marginLeft: 14,
      },
    },
  },
  popper: {
    zIndex: 99999,
    "& .MuiAutoComplete-option": {
      fontSize: 12,
      paddingLeft: 2,
      paddingRight: 2,
      paddingInline: 2,
    },
  },
  autoCompleteRoot: {
    width: 100,
    "& .MuiOutlinedInput-root": {
      padding: 0,
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none",
    },
    "& .MuiInputBase-input": {
      fontSize: 12,
      fontFamily: themeConfig.typography.h6.fontFamily,
      fontWeight: 400,
    },
  },
  popperStyle: {
    zIndex: 99999,
    // minWidth: 120,
    "& .MuiAutocomplete-listbox": {
      background: "#fff",
    },
  },
  icon: {
    padding: 0,
    "& .MuiSvgIcon-root": {
      fontSize: 14,
      color: "#ff0000",
    },
  },
  errorIcon: {
    "& .MuiSvgIcon-root": {
      fontSize: 14,
      color: "#ff0000",
    },
  },
  popupIcon: {
    padding: 2,
    "& .MuiSvgIcon-root": {
      fontSize: 18,
      color: "#000",
    },
  },
  checkIcon: {
    padding: 0,
    "& .MuiSvgIcon-root": {
      fontSize: 20,
      color: themeConfig.palette.lyfngo.primary.main,
    },
  },
}));

const CustFormdata = (props) => {
  const {
    token,
    domainData,
    setBotCustId,
    setBotCheadId,
    botName,
    setBotName,
    botNum,
    setBotNum,
    botEmail,
    setBotEmail,
    aiSetStatus,
    custName,
    mobileNumber,
    custEmail,
    selectionMode,
    country,
    setCountry,
    jsonFetch,
  } = useAuth();
  const {
    setMessages,
    saveLoggedChats,
    moblen,
    setMoblen,
    setCurrentState,
    currentState = [{ NameMobileForm: {} }],
    register,
    handleSubmit,
    errors,
    reset,
    setLoading,
    nextStepCase,
  } = props;
  const [formData, setFormData] = useState({
    name: currentState[0]?.NameMobileForm?.name || "",
    phoneNum: currentState[0]?.NameMobileForm?.mobile || "",
    email: currentState[0]?.email || "",
    terms: currentState[0]?.NameMobileForm?.terms || true,
  });
  const classes = useStyles();
  const sessionId = secureLocalStorage.getItem("botSessionId");
  const [countryCode, setcountryCode] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const getDialCodeDetails = () => {
    const onSuccess = (res) => {
      if (res?.data?.status === true) {
        const code = _.orderBy(res?.data?.data, "mastLookupKey", "desc");
        setcountryCode(code);
      }
    };
    const onFailure = (err) => {
      console.log("error", err);
    };
    BotApi.CountryCodeGet().then(onSuccess, onFailure);
  };

  useEffect(() => {
    getDialCodeDetails();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(countryCode)) {
      let findCountry = secureLocalStorage?.getItem("countryCode");
      let temp = findCountry?.slice(1);
      let initialCountryCode = _.find(countryCode, {
        mastLookupKey: temp,
      });
      setMoblen(initialCountryCode?.mastLookupValue);
      setCountry(initialCountryCode);
    }
  }, [countryCode]);

  const str = "+";

  const CustomPopper = function (props) {
    return (
      <Popper
        {...props}
        className={classes.popperStyle}
        placement="bottom-start"
      />
    );
  };

  const handleFormSubmit = (data) => {
    const body = {
      Name: data?.name,
      Phone: "+" + country?.mastLookupKey + data?.phoneNum,
      Type: "micro_bot",
      MastTentUuid: domainData?.mastTentUuid,
      custEmail: data?.email,
      custUuid: null,
      sessionId: sessionId,
    };
    setLoading(true);
    const onSuccess = (res) => {
      setLoading(false);
      aiSetStatus(false);
      setFormSubmitted(true);
      secureLocalStorage.setItem("AIstatus", false);
      localStorage.setItem("chatStateTime", new Date().getTime());
      secureLocalStorage.setItem("botName", data?.name);
      setBotName(data?.name);
      secureLocalStorage.setItem("botNum", data?.phoneNum);
      setBotNum(data?.phoneNum);
      secureLocalStorage.setItem("botEmail", data?.email);
      setBotEmail(data?.email);
      secureLocalStorage.setItem("bot_custUuid", res?.data?.data?.cust_uuid);
      setBotCustId(res?.data?.data?.cust_uuid);
      localStorage.setItem("bot_cheadId", res?.data?.data?.chead_id);
      setBotCheadId(res?.data?.data?.chead_id);
      if (_.isEmpty(selectionMode)) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            name: "ChooseChatOption",
            type: "bot",
            jsonType: "NonCard",
            component: "ChatOption",
            data: {},
          },
        ]);
      } else {
        nextStepCase(selectionMode, jsonFetch);
      }
      setCurrentState((prevState) => [
        {
          ...prevState[0],
          NameMobileForm: {
            ...prevState[0]?.NameMobileForm,
            name: data?.name,
            mobile: data?.phoneNum,
            country: str + country?.mastLookupKey,
            email: data?.email,
          },
        },
      ]);
    };
    const onFailure = (err) => {
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "OptionSelection",
          type: "bot",
          jsonType: "card",
          component: "",
          data: {
            message: "Internal Error. Please try again.",
          },
        },
      ]);
      setCurrentState((prevState) => [
        {
          ...prevState[0],
          NameMobileForm: {
            ...prevState[0]?.NameMobileForm,
            name: data?.name,
            mobile: data?.phoneNum,
            country: str + country?.mastLookupKey,
          },
        },
      ]);
      reset();
    };
    BotApi.getLeadDetails(body).then(onSuccess, onFailure);
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
      className={classes.root}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontSize: themeConfig.typography.subtitle1.fontSize,
          fontFamily: themeConfig.typography.subtitle1.fontFamily,
          fontWeight: 500,
        }}
      >
        Please enter the details
      </Typography>
      <form
        onSubmit={() => handleSubmit(handleFormSubmit)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexDirection: "column",
        }}
      >
        <TextField
          id="name"
          size="small"
          autoFocus
          autoComplete="off"
          fullWidth
          className={errors?.name ? classes.errorInput : classes.input}
          variant="outlined"
          {...register("name")}
          value={botName || custName}
          error={!!errors.name}
          disabled={botName || token}
          placeholder="Name"
          InputProps={{
            endAdornment: errors.name ? (
              <InputAdornment position="end">
                <IconButton className={classes.icon}>
                  <ErrorIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        <div className={classes.container}>
          <Autocomplete
            loadingText="Loading.."
            ListboxProps={{
              style: {
                maxHeight: "12rem",
                fontSize: 14,
                fontFamily: ['"Poppins"', "sans-serif"].join(","),
              },
            }}
            sx={{
              "& fieldset": { borderRight: "none", padding: 0 },
              "& .MuiOutlinedInput-root": {
                paddingRight: "30px!important",
              },
            }}
            id="select"
            className={classes.autoCompleteRoot}
            popupIcon={
              <IconButton className={classes.popupIcon}>
                <KeyboardArrowDownIcon />
              </IconButton>
            }
            componentName="button"
            disableClearable
            name="countryCodeOptions"
            onChange={(e, value) => {
              setCountry(value);
              setMoblen(value?.mastLookupValue);
            }}
            disabled={token !== null}
            size="small"
            value={country}
            options={_.orderBy(countryCode, "mastLookupKey")}
            getOptionLabel={(option) => str.concat(option?.mastLookupKey || "")}
            classes={{ popper: classes.popper }}
            PopperComponent={CustomPopper}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  size="small"
                  id="dropdownText"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      paddingRight: 0,
                    },
                  }}
                />
              );
            }}
          />
          <TextField
            id="mobileNumber"
            size="small"
            autoComplete="off"
            fullWidth
            className={errors?.phoneNum ? classes.errorInput : classes.input}
            variant="outlined"
            type="tel"
            sx={{
              "& fieldset": { borderLeft: "none" },
            }}
            {...register("phoneNum")}
            value={botNum || mobileNumber}
            disabled={botNum || mobileNumber || token}
            error={!!errors?.phoneNum}
            inputProps={{ maxLength: moblen }}
            onKeyPress={(e) => {
              if (new RegExp(/[0-9]/).test(e.key)) {
              } else e.preventDefault();
            }}
            InputProps={{
              endAdornment: errors.phoneNum ? (
                <InputAdornment position="end">
                  <IconButton className={classes.errorIcon}>
                    <ErrorIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </div>
        <TextField
          id="email"
          size="small"
          autoComplete="off"
          fullWidth
          className={errors?.email ? classes.errorInput : classes.input}
          variant="outlined"
          type="email"
          {...register("email")}
          value={botEmail || custEmail}
          disabled={botEmail || custEmail || token || formSubmitted}
          error={!!errors?.email}
          placeholder="Email"
          InputProps={{
            endAdornment: errors.email ? (
              <InputAdornment position="end">
                <IconButton className={classes.icon}>
                  <ErrorIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
          <Checkbox
            sx={{ padding: 0, color: themeConfig.palette.lyfngo.primary.main }}
            size={"small"}
            id="checkbox"
            {...register("terms", true)}
            checked={formData?.terms || false}
            checkedIcon={
              <IconButton className={classes.checkIcon}>
                <CheckBoxIcon />
              </IconButton>
            }
            onChange={(e) =>
              setFormData({ ...formData, terms: e.target.checked })
            }
            inputProps={{ "aria-label": "controlled" }}
            error={!!errors.terms}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: 11,
              fontFamily: themeConfig.typography.subtitle1.fontFamily,
            }}
          >
            By checking this box, you agree our{" "}
            <a
              style={{ textDecoration: "underline", cursor: "pointer" }}
              target="_blank"
            >
              Terms and condition
            </a>{" "}
            and{" "}
            <a
              style={{ textDecoration: "underline", cursor: "pointer" }}
              target="_blank"
            >
              Privacy Policy
            </a>
          </Typography>
        </div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            width: "85px",
            height: "32px",
            display: "flex",
            alignSelf: "flex-end",
          }}
        >
          <Button
            sx={{
              width: "85px",
              height: "32px",
              background: themeConfig.palette.lyfngo.primary.main,
              textTransform: "capitalize",
              color: "#fff",
              fontSize: themeConfig.typography.subtitle1.fontSize,
              fontFamily: themeConfig.typography.subtitle1.fontFamily,
              "&:hover": {
                background: themeConfig.palette.lyfngo.primary.main,
              },
            }}
            variant="contained"
            style={{ borderRadius: "8px" }}
            disabled={botNum || token}
            id="sigin_submit"
            onClick={() => handleSubmit(handleFormSubmit)()}
          >
            {botNum || token ? "Submitted" : "Submit"}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default CustFormdata;

import { csrf } from "../../Utils/csrf";
import { API_ENDPOINTS } from "../../Constants";
import axios from "axios";

const headers1 = {
  "Content-Type": "application/json;charset=UTF-8",
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_HEADER_ACCESS,
  "Access-Control-Allow-Credentials": "true",
  isAuthRequired: true,
  // 'X-SECURITY': csrf(),
  withCredentials: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getSavedChats: (custUuid) => {
    return axios.get(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.GET_USER_CHATS,
      {
        headers: { Internal: "LYFnGO", isAes: false, path: custUuid },
      }
    );
  },

  postUserChats: (body) => {
    return axios.post(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.POST_USER_CHATS,
      body,
      {
        headers: {
          ...headers1,
          Internal: "LYFnGO",
          isAes: false,
          path: custUuid,
        },
      }
    );
  },
  getLeadDetails: (body) => {
    return axios.post(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.CONNECT_REQUEST,
      body,
      {
        headers: { ...headers1, isAes: false },
      }
    );
  },
  CountryCodeGet: () => {
    return axios.get(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.LOOK_UP_BOT_DIAL,
      { headers: { isAes: false } },
      { timeout: 1 }
    );
  },
  getBookingModes: (params) => {
    return axios.get(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.GET_BOOK_MODES,
      {
        headers: { Internal: "LYFnGO", isAes: false },
        params: { ...params },
      }
    );
  },

  getTentuser: (params) => {
    return axios.get(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.GET_TENTUSER_LIST,
      {
        headers: { Internal: "LYFnGO", isAes: false },
        params: { ...params },
        //    tentId=1bs7a1ib&appointmentMode=at-clinic
      }
    );
  },
  GetTentUsersListDetails: (mastTentUuid, params) => {
    const path =
      process.env.NEXT_PUBLIC_API_PROFILE +
      "/profiles/b2c/getSpecialist/:mastTentUuid";
    const urlWithParams = path.replace(":mastTentUuid", mastTentUuid);
    return axios.get(urlWithParams, {
      headers: { ...headers1, isAes: false },
      params: { ...params },
    });
  },
  getSlot: (params) => {
    return axios.get(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.AVAILABLE_APPOINTMENT,
      {
        headers: { Internal: "LYFnGO", isAes: false },
        params: { ...params },
        // ?tentId=1bs7a1ib&scheduledOn=2024-03-06&tentUserId=y4557njl&appointmentMode=at-clinic
      }
    );
  },

  postEmail: (body) => {
    return axios.post(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.POST_EMAIL_REQUEST,
      body,
      {
        headers: { ...headers1, Internal: "LYFnGO", isAes: false },
      }
    );
  },

  bookDemo: (data) => {
    return axios.post(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.APPOINTMENT_POST,
      { ...data },
      {
        headers: { Internal: "LYFnGO", isAes: false },
      }
    );
  },
  rescheduleApp: (data) => {
    return axios.put(
      process.env.NEXT_PUBLIC_API_PROFILE +
        API_ENDPOINTS.RESCHEDULE_APPOINTMENT,
      data,
      {
        headers: { Internal: "LYFnGO", isAes: false },
      }
    );
  },
  cancelAppt: (data) => {
    return axios.put(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.CANCEL_APPOINTMENT,
      data,
      {
        headers: { Internal: "LYFnGO", isAes: false },
      }
    );
  },
  googleMeetingLinkGeneration: (data, mastTentUuid) => {
    return axios.post(
      `${
        process.env.NEXT_PUBLIC_API_PROFILE +
        API_ENDPOINTS.GOOGLE_MEET_LINK_APPOINTMENT
      }/${mastTentUuid}`,
      data,
      {
        headers: { Internal: "LYFnGO", isAes: false },
      }
    );
  },
  waitRequest: (cheadId) => {
    return axios.get(
      process.env.NEXT_PUBLIC_API_PROFILE +
        API_ENDPOINTS.CHAT_REQUEST +
        cheadId,
      {
        headers: { Internal: "LYFnGO", isAes: false },
      }
    );
  },
  createChatSession: (data) => {
    return axios.post(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.CREATE_CHAT_SESSION,
      data,
      {
        headers: { Internal: "LYFnGO", isAes: false },
      }
    );
  },
  sendMsg: (params, mastTentUuid) => {
    return axios.post(
      `${
        process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.CHAT_SEND_MSG
      }/${mastTentUuid}`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  },
  getFAQ: (mastUuid) => {
    return axios.get(
      `${
        process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.GET_FAQ
      }/${mastUuid}`,
      {
        headers: { Internal: "LYFnGO", isAes: false },
      }
    );
  },
  resetChat: (mastUuid, params) => {
    return axios.get(
      `${
        process.env.NEXT_PUBLIC_BOT_URL + API_ENDPOINTS.RESET_CHAT
      }/${mastUuid}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        params: { ...params },
      }
    );
  },
  postFeedack: (data, mastUuid) => {
    return axios.post(
      `${
        process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.POST_FEEDBACK_UPLOAD
      }`,
      { ...data },
      {
        headers: {
          ...headers1,
          Internal: "LYFnGO",
          "X-SECURITY": csrf(),
          path: mastUuid,
        },
      }
    );
  },
  getDoctorsList: (mastUuid) => {
    const path =
      process.env.NEXT_PUBLIC_API_PROFILE +
      "/communication/llm/doctor/information/get/:mastUuid";
    const urlWithParams = path.replace(":mastUuid", mastUuid);
    return axios.get(urlWithParams, {
      headers: { Internal: "LYFnGO", isAes: false },
    });
  },
  getAppointmentsList: (params) => {
    return axios.get(
      process.env.NEXT_PUBLIC_API_PROFILE +
        API_ENDPOINTS.GET_APPOINTMENT_DETAILS,
      {
        headers: { ...headers1, Internal: "LYFnGO", "X-SECURITY": csrf() },
        params: { ...params },
      }
    );
  },
  getTentUserID: (params) => {
    return axios.get(
      process.env.NEXT_PUBLIC_API_PROFILE + API_ENDPOINTS.GET_TENT_USER_ID,
      {
        headers: { ...headers1, Internal: "LYFnGO", "X-SECURITY": csrf() },
        params: { ...params },
      }
    );
  },
};

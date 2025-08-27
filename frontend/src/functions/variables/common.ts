import type { UserCred } from "../../types/common";

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
export const INTERNAL_SERVER_ERROR = "Internal Server Error"
export const UI_ERROR_MESSAGE = "Server error, check your connection"
export const SESSION_DATA: UserCred = JSON.parse(sessionStorage.getItem("userCred") || "{}");
export const UID = SESSION_DATA._id;
export const USER_NAME = SESSION_DATA.userName;
export const USER_EMAIL = SESSION_DATA.email;

import type { UserCred } from "../../types/common";

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
export const INTERNAL_SERVER_ERROR = "Internal Server Error"
export const UI_ERROR_MESSAGE = "Server error, check your connection"
export const SESSION_DATA: UserCred = JSON?.parse(localStorage?.getItem("userCred") || "{}");
export const UID = SESSION_DATA._id;
export const USER_NAME = SESSION_DATA.userName;
export const USER_EMAIL = SESSION_DATA.email;


// A helper function to safely parse session data
const getSessionData = () => {
  try {
    const sessionStr = localStorage.getItem('userCred'); // Assuming 'SESSION_DATA' is the key
    return sessionStr ? JSON.parse(sessionStr) : null;
  } catch (error) {
    console.error("Error parsing session data from localStorage:", error);
    return null;
  }
};

// Now, export functions that retrieve the data dynamically
export const getUID = () => {
  const session = getSessionData();
  return session ? session._id : null;
};

export const getUserName = () => {
  const session = getSessionData();
  return session ? session.userName : null;
};

export const getUserEmail = () => {
  const session = getSessionData();
  return session ? session.email : null;
};

// You might also want a single function to get all data
export const getAllSessionData = () => getSessionData();
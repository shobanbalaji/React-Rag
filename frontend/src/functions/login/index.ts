import axios from "axios";
import type { loginType } from "../../types";
import { API_ENDPOINT } from "../variables/common";

const loginUser = async (form: loginType) => {
    const response = await axios.post(`${API_ENDPOINT}authentication/authUser`, form);
    return response.data;
}

const checkUserExist = async(userId, {userId:str}) => {
    const response = await axios.get("authenticate/verifyUser", userId);
    return response.data
}

export {
    loginUser,
    checkUserExist
}
import axios from "axios";
import { API_ENDPOINT, INTERNAL_SERVER_ERROR } from "../variables/common";

// Get User Chats
const getUserChats = async ({ userId }: { userId: string }) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}chat/getChat`, {
            headers: { userId }
        });
        console.log(response, "response")
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
};

// Create Chat
const createChat = async ({ userId, message, c_id }: { userId: string, message?: string, c_id?: string }) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}chat/createChat`, {
            // message,
            // c_id
        }, {
            headers: { userId }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
};

// Rename Chat
const renameChat = async ({ userId, c_id, c_n }: { userId: string, c_id: string, c_n: string }) => {
    try {
        const response = await axios.patch(`${API_ENDPOINT}chat/renameChat`, {
            c_id, c_n
        }, {
            headers: { userId }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
};

// Delete Chat
const deleteChat = async ({ userId, c_id }: { userId: string; c_id: string }) => {
    try {
        const response = await axios.delete(`${API_ENDPOINT}chat/deleteChat/${c_id}`, {
            headers: { userId },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
};

// Send Conversion
const sendConversion = async ({ userId, message, chatId }: { userId: string; message: string, chatId: string }) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}chat/chatRequest`, { message, c_id: chatId }, {
            headers: { userId }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
};

const fetchConversation = async ({ userId, chatId }: { userId: string, chatId: string }) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}chat/fetchChats`, {
            params: { c_id: chatId },
            headers: { userId: userId }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
}

export {
    getUserChats,
    createChat,
    renameChat,
    deleteChat,
    sendConversion,
    fetchConversation,
};

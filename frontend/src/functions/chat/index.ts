import axios from "axios";
import { API_ENDPOINT, INTERNAL_SERVER_ERROR } from "../variables/common";
import { getUID } from "../variables/common";


// Get User Chats
const getUserChats = async () => {
    try {
        const UID = getUID();
        const response = await axios.get(`${API_ENDPOINT}chat/getChat`, {
            headers: { userId: UID  }
        });
        return response.data;
    } catch (error) {
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
};

// Create Chat
const createChat = async () => {
    try {
        const UID = getUID();
        const response = await axios.post(`${API_ENDPOINT}chat/createChat`, {
            // message,
            // c_id
        }, {
            headers: { userId: UID  }
        });
        return response.data;
    } catch (error) {
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
};

// Rename Chat
const renameChat = async ({ c_id, c_n }: {c_id: string, c_n: string }) => {
    try {
        const UID = getUID();
        const response = await axios.patch(`${API_ENDPOINT}chat/renameChat`, {
            c_id, c_n
        }, {
            headers: { userId: UID  }
        });
        return response.data;
    } catch (error) {
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
};

// Delete Chat
const deleteChat = async ({ c_id }: {c_id: string }) => {
    try {
        const UID = getUID();
        const response = await axios.delete(`${API_ENDPOINT}chat/deleteChat/${c_id}`, {
            headers: { userId: UID  },
        });
        return response.data;
    } catch (error) {
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
};

// Send Conversion
const sendConversion = async ({message, chatId, type, file, mode}: {  message: string, chatId: string, type: string, file:any, mode: string}) => {
    try {
        const UID = getUID();
        const formData = new FormData();
        formData.append("message", message);
        formData.append("c_id", chatId ? chatId: "auto");
        formData.append("c_t", type);
        formData.append("mode", mode);

        if (file) {
          formData.append("file", file); // always "file"
        }

        const response = await axios.post(`${API_ENDPOINT}chat/chatRequest`, formData, {
          headers: {
            userId: UID,
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
    } catch (error) {
        return {
            code: 500,
            message: `${INTERNAL_SERVER_ERROR} : ${error}`,
            success: false
        };
    }
};

const fetchConversation = async ({  chatId }: { chatId: string }) => {
    try {
        const UID = getUID();
        const response = await axios.get(`${API_ENDPOINT}chat/fetchChats`, {
            params: { c_id: chatId },
            headers: { userId: UID }
        });
        return response.data;
    } catch (error) {
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

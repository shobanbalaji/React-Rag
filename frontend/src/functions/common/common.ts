import toast from "react-hot-toast";

export const makeSuccessToast = (message: string) => {
    toast.success(message);
}

export const makeErrorToast = (message: string) => {
    toast.error(message);
}

export const makeWarningToast = (message: string) => {
    toast(`⚠️ ${message} `, {
        style: {
            border: "1px solid #facc15",
            padding: "16px",
            color: "#92400e",
            background: "#fef3c7",
        },
        iconTheme: {
            primary: "#facc15",
            secondary: "#fff",
        },
    });
}
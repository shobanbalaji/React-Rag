export type messageList = {
    id: string;
    chatName: string;
    createdAt?: string;
    updatedAt?: string;
};

export type chatListProps = {
    _id: string;
    chatName: string;
}

export type messageListProps = {
    sidebar: boolean;
    setSidebar: (bar: boolean) => void;
    chatId: string;
    setChatId: (id: string) => void;
    chatList: chatListProps[];
    setChatList: (list: chatListProps[]) => void;
}

export type conversationDataProps = {
    chatId:string;
    message:string;
    response:string;
    createdAt:Date;
    updatedAt:Date;
}


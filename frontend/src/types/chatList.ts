export type messageList = {
    id: string;
    chatName: string;
    createdAt?: string;
    updatedAt?: string;
};

export type messageListProps={
    sidebar:boolean;
    setSidebar:(bar: boolean) => void;
    chatId:string
    setChatId:(id:string) => void;
}